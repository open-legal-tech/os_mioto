import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  OutputFixingParser,
  StructuredOutputParser,
} from "langchain/output_parsers";
import { isDefined, mapValues } from "remeda";
import type { ValuesType } from "utility-types";
import { z } from "zod";
import { getText } from "../../../../rich-text-editor/exports/RichText/transformers/text";
import { convertToRichTextJson } from "../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import {
  type PrimitiveVariable,
  RecordVariable,
  isDefinedFileVariable,
} from "../../../../variables/exports/types";
import type { ActionParams } from "../exports/action";
import { AINode, type IAINode } from "../exports/plugin";
import { createVectorStoreFromPdfs } from "./createVectorStoreFromPdfs";
import { model_3, model_4 } from "./models";
import { workflowBuilderEnv } from "../../../../../env";
import { getFileContent } from "@mioto/server/File/getContent";

export async function extractionAINodeAction({
  getVariables,
  getVariable,
  node,
  db,
  user,
  nodeId,
  treeClient,
  locale,
}: ActionParams) {
  const variables = getVariables({
    filterPrimitives: (variable): variable is PrimitiveVariable =>
      variable.type === "number" ||
      variable.type === "date" ||
      variable.type === "text" ||
      variable.type === "boolean",
  });

  const yNode = treeClient.nodes.get.yNode(nodeId);

  const fileVariables = node.files.map((attachementId) => {
    const { recordId } = RecordVariable.splitVariableId(attachementId);

    return {
      attachementId,
      variable: getVariable(recordId),
    } as const;
  });

  const files = (
    await Promise.all(
      fileVariables.map(async ({ attachementId, variable }) => {
        if (!variable) return;

        const value = RecordVariable.getChildValue(variable, attachementId);

        if (!isDefinedFileVariable(value)) return undefined;

        const fileContent = {
          file: await getFileContent(db)({
            fileUuid: value.value.uuid,
            orgUuid: user.organizationUuid,
          }),
          ...value,
        };

        if (!fileContent.file) return;

        return new Blob([fileContent.file.content]);
      }),
    )
  ).filter(isDefined);

  const metaPrompt = yNode.get("yMainPrompt");

  try {
    const aiResult = await askAI({
      prompts: mapValues(node.prompts, (prompt) => {
        const yFormattingInstruction = yNode
          .get("prompts")
          .get(prompt.id)
          .get("yFormattingInstruction");
        const yDescription = yNode
          .get("prompts")
          .get(prompt.id)
          .get("yDescription");

        return {
          ...prompt,
          yDescription: yDescription
            ? getText({
                json: convertToRichTextJson(yDescription),
                locale,
                variables,
                fileVariables: {},
              })
            : "",
          yFormattingInstruction: yFormattingInstruction
            ? getText({
                json: convertToRichTextJson(yFormattingInstruction),
                locale,
                variables,
                fileVariables: {},
              })
            : "",
        };
      }),
      files,
      orgSlug: user.Organization.slug,
      model: node.model,
      metaPrompt: metaPrompt
        ? getText({
            json: convertToRichTextJson(metaPrompt),
            locale,
            variables,
            fileVariables: {},
          })
        : undefined,
    });

    return {
      type: "EVALUATE",
      nodeId,
      variable: AINode.createVariable({
        nodeId,
        execution: "success",
        value: mapValues(node.prompts, (prompt) => aiResult[prompt.name]),
      })(treeClient).variable,
    } as const;
  } catch (error) {
    console.error(JSON.stringify(error));
    return {
      type: "INVALID_EXECUTION",
      error: "unknown_error",
    } as const;
  }
}

async function askAI({
  prompts,
  files,
  orgSlug,
  model,
  metaPrompt,
}: {
  prompts: Record<
    string,
    Omit<
      ValuesType<IAINode["prompts"]>,
      "yDescription" | "yFormattingInstruction"
    > & {
      yDescription?: string;
      yFormattingInstruction?: string;
    }
  >;
  files: Blob[];
  orgSlug: string;
  model: ValuesType<IAINode["model"]>;
  metaPrompt?: string;
}) {
  const vectorStore = await createVectorStoreFromPdfs(files);

  const structuredOutputs = (description?: string) => ({
    text: StructuredOutputParser.fromZodSchema(
      z.object({
        answer: z
          .string()
          .describe(
            description ? description : "Short answer to the users question.",
          ),
      }),
    ),
    number: StructuredOutputParser.fromZodSchema(
      z.object({
        answer: z
          .string()
          .describe(
            "Find the number that answers the user's question. Output only the number.",
          ),
      }),
    ),
    boolean: StructuredOutputParser.fromZodSchema(
      z.object({
        answer: z
          .string()
          .describe("Answers the users question with true or false."),
      }),
    ),
  });

  const promptTemplate = PromptTemplate.fromTemplate(
    `{metaPrompt}

    Question:
    {question}

    Document data:
    {context}

    Format the answer based on these instructions:
    {format_instructions}`,
  );

  const result = await Promise.all(
    Object.values(prompts).map(async (prompt) => {
      const parser = structuredOutputs(prompt.yFormattingInstruction)[
        prompt.type
      ];

      const chain = RunnableSequence.from([
        {
          metaPrompt: (input) => input.metaPrompt,
          name: (input) => input.name,
          question: (input) =>
            input.description
              ? input.description
              : `Find the data that corresponds to this word: ${input.name}`,
          format_instructions: (input) => input.format_instructions,
          context: async (input) =>
            (await vectorStore.asRetriever().getRelevantDocuments(input.name))
              .map((doc) => doc.pageContent)
              .join("\n"),
        },
        promptTemplate,
        model === "gpt-3.5" ? model_3 : model_4,
        parser.withFallbacks({
          fallbacks: [OutputFixingParser.fromLLM(model_4, parser)],
        }),
      ]);

      const result = await chain.invoke(
        {
          name: prompt.name,
          description: prompt.yDescription,
          metaPrompt:
            metaPrompt ??
            "You are used to extract information. Return only the information itself without additional context and without turning it into a sentence.",
          format_instructions: parser.getFormatInstructions(),
        },
        { tags: [orgSlug, workflowBuilderEnv.APP_ENV] },
      );

      return {
        name: prompt.name,
        result,
      };
    }),
  );

  const resultObject = {} as Record<string, any>;
  result.forEach((res) => {
    resultObject[res.name] = res.result.answer;
  });

  return resultObject;
}
