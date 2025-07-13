import { indexBy, values } from "remeda";
import { match } from "ts-pattern";
import type { ValuesType } from "utility-types";
import type { XmlFragment } from "yjs";
import { createUnproxiedYRichTextFragment } from "../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type { TChildId, TId, TMainChildId, TNodeId } from "../../../../tree/id";
import {
  type INode,
  NodePlugin,
  type createFn,
  type createVariableFn,
  type isAddableFn,
} from "../../../../tree/type/plugin/NodePlugin";
import type { TTreeClient } from "../../../../tree/type/treeClient";
import {
  BooleanVariable,
  type IBooleanVariable,
  type INumberVariable,
  type IRecordVariable,
  type ITextVariable,
  NumberVariable,
  RecordVariable,
  TextVariable,
} from "../../../../variables/exports/types";
import { convertContentToYContent } from "../../shared/convertContentToYContent";
import { addFormattingInstructions } from "./migrations/addFormattingInstructions";

export const typeName = "ai" as const;

export interface IAINode extends INode<typeof typeName> {
  prompts: Record<
    string,
    | {
        id: TId;
        name: string;
        yDescription: XmlFragment;
        type: "number" | "boolean";
      }
    | {
        yFormattingInstruction: XmlFragment;
        type: "text";
        id: TId;
        name: string;
        yDescription: XmlFragment;
      }
  >;
  yMainPrompt: XmlFragment;
  files: (TChildId | TMainChildId)[];
  model: "gpt-3.5" | "gpt-4";
  aiType?: "extraction" | "decision";
}

export class AINodePlugin extends NodePlugin<IAINode> {
  readonly hasAction = true;
  readonly hasRenderer = false;
  readonly hasWebhook = false;
  readonly hasSidebar = true;
  readonly hasCanvasNode = true;
  override readonly isAlpha = true;

  override isAddable: isAddableFn = () => {
    return true;
  };

  override shouldIncludeInNavigation(_: {
    node: IAINode;
    variables: Record<string, IRecordVariable>;
  }): boolean {
    return false;
  }

  constructor() {
    super({
      type: typeName,
      pluginMigrations: [
        convertContentToYContent("content", "yContent"),
        addFormattingInstructions,
      ],
      blockGroup: "action",
    });
  }

  create: createFn<IAINode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<IAINode>({
      type: this.type,
      version: this.version,
      pluginVersion: this.pluginVersion,
      prompts: {},
      files: [],
      yMainPrompt: createUnproxiedYRichTextFragment(),
      model: "gpt-4",
      ...data,
    });
  };

  createVariable: createVariableFn<
    ITextVariable | INumberVariable | IBooleanVariable
  > =
    ({ nodeId, execution = "unexecuted", value }) =>
    (treeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      let variables: (ITextVariable | IBooleanVariable | INumberVariable)[];
      if (node.aiType === "decision") {
        variables = [
          TextVariable.create({
            name: "Textantwort",
            id: RecordVariable.createChildIdPath(nodeId, "text_1"),
            execution,
            value: value?.textAnswer,
          }),
          BooleanVariable.create({
            name: "Wahr/Falsch",
            id: RecordVariable.createChildIdPath(nodeId, "boolean_1"),
            execution,
            value: value?.booleanAnswer,
            values: {
              true: "Wahr",
              false: "Falsch",
            },
            readableValue: value?.booleanAnswer,
          }),
        ];
      } else {
        variables = values(node.prompts).map((prompt) =>
          match(prompt)
            .with({ type: "text" }, (prompt) =>
              TextVariable.create({
                name: prompt.name,
                id: RecordVariable.createChildIdPath(nodeId, prompt.id),
                execution,
                value: value?.[prompt.id],
              }),
            )
            .with({ type: "number" }, (prompt) =>
              NumberVariable.create({
                name: prompt.name,
                id: RecordVariable.createChildIdPath(nodeId, prompt.id),
                execution,
                value: value?.[prompt.id],
              }),
            )
            .with({ type: "boolean" }, (prompt) =>
              BooleanVariable.create({
                execution,
                id: RecordVariable.createChildIdPath(nodeId, prompt.id),
                name: prompt.name,
                value: value?.[prompt.id],
                readableValue: value?.[prompt.id]?.toString() ?? "",
                values: {
                  true: "True",
                  false: "False",
                },
              }),
            )
            .exhaustive(),
        );
      }

      return {
        variable: treeClient.nodes.create.variable(node, {
          execution,
          // TODO Remove any
          value: indexBy(variables, (value) => value.id) as any,
        }),
      };
    };

  updateAttachements =
    (nodeId: TNodeId, files: (TMainChildId | TChildId)[] = []) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      node.files = files;
    };

  addPrompt =
    (nodeId: TNodeId, prompt: Partial<IAINode["prompts"][0]>) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);
      const id = `prompt_${crypto.randomUUID()}` as const;

      node.prompts[id] = {
        id,
        name: "",
        type: "text",
        yDescription: createUnproxiedYRichTextFragment(),
        yFormattingInstruction: createUnproxiedYRichTextFragment(),
        ...prompt,
      };
    };

  updatePrompts =
    (
      nodeId: TNodeId,
      prompts: Record<
        string,
        Partial<ValuesType<IAINode["prompts"]>> | undefined
      >,
    ) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      Object.entries(prompts).forEach(([id, newData]) => {
        if (!newData) return;
        const { name, type } = newData;

        const prompt = node.prompts[id];

        if (!prompt) {
          throw new Error(
            "Prompt not found when looping over the prompts. This should never happen.",
          );
        }

        if (name) {
          prompt.name = name;
        }

        if (type) {
          prompt.type = type;
        }
      });
    };

  removePrompt =
    (nodeId: TNodeId, promptId: TId) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);
      delete node.prompts[promptId];
    };

  updateModel =
    (nodeId: TNodeId, model: IAINode["model"]) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);
      node.model = model;
    };

  updateAIType =
    (nodeId: TNodeId, aiType: IAINode["aiType"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);
      node.aiType = aiType;
    };
}

export const AINode = new AINodePlugin();
