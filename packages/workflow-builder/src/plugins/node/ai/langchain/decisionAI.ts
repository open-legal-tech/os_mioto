import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { getFileContent } from "@mioto/server/File/getContent";
import { StructuredOutputParser } from "langchain/output_parsers";
import { isDefined } from "remeda";
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

export async function decisionAINodeAction({
  getVariables,
  getVariable,
  node,
  db,
  user,
  nodeId,
  treeClient,
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

  const yMetaPrompt = yNode.get("yMainPrompt");
  const metaPrompt = yMetaPrompt
    ? getText({
        json: convertToRichTextJson(yMetaPrompt),
        locale: "de",
        variables,
        fileVariables: {},
      })
    : undefined;

  if (!metaPrompt) {
    return {
      type: "INVALID_EXECUTION",
      error: "no_meta_prompt",
    } as const;
  }

  try {
    const aiResult = await askAI({
      files,
      orgSlug: user.Organization.slug,
      model: node.model,
      metaPrompt,
    });

    return {
      type: "EVALUATE",
      nodeId,
      variable: AINode.createVariable({
        nodeId,
        execution: "success",
        value: aiResult,
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
  files,
  orgSlug,
  model,
  metaPrompt,
}: {
  files: Blob[];
  orgSlug: string;
  model: ValuesType<IAINode["model"]>;
  metaPrompt: string;
}) {
  const vectorStore = await createVectorStoreFromPdfs(files);

  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      textAnswer: z.string().describe("Give a text answer for the question."),
      booleanAnswer: z.coerce
        .boolean()
        .describe("Give a boolean answer for the question."),
    }),
  );

  const promptTemplate = PromptTemplate.fromTemplate(
    `Instructions:
    {metaPrompt}

    Document data:
    {context}

    Format the answer based on these instructions:
    {format_instructions}`,
  );

  const chain = RunnableSequence.from([
    {
      metaPrompt: (input) => input.metaPrompt,
      format_instructions: (input) => input.format_instructions,
      context: async (input) =>
        (await vectorStore.asRetriever().getRelevantDocuments(input.metaPrompt))
          .map((doc) => doc.pageContent)
          .join("\n"),
    },
    promptTemplate,
    model === "gpt-3.5" ? model_3 : model_4,
    parser,
  ]);

  const result = await chain.invoke(
    {
      metaPrompt,
      format_instructions: parser.getFormatInstructions(),
    },
    { tags: [orgSlug, workflowBuilderEnv.APP_ENV] },
  );

  return result;
}
