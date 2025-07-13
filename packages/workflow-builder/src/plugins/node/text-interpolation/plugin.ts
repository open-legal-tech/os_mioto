import { FatalError } from "@mioto/errors";
import type { XmlFragment } from "yjs";
import { createUnproxiedYRichTextFragment } from "../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type { TMainChildId } from "../../../tree/id";
import {
  type INode,
  NodePlugin,
  type createFn,
  type createVariableFn,
} from "../../../tree/type/plugin/NodePlugin";
import {
  type IRichTextVariable,
  type ITextVariable,
  RecordVariable,
  RichTextVariable,
  TextVariable,
  type Variable,
} from "../../../variables/exports/types";

export const typeName = "text-interpolation" as const;

export interface ITextInterpolationNode extends INode<typeof typeName> {
  yContent: XmlFragment;
  isFormatted?: boolean;
}

export class TextInterpolationPlugin extends NodePlugin<ITextInterpolationNode> {
  readonly hasAction = true;
  readonly hasRenderer = false;
  readonly hasWebhook = false;
  readonly hasSidebar = true;
  readonly hasCanvasNode = true;
  override shouldIncludeInNavigation(
    _variables: Record<`node_${string}`, Variable>,
  ): boolean {
    return false;
  }
  description =
    "Der Textkombinationsblock wird verwendet, um Text zu kombinieren. Er produziert eine Textvariable.";

  constructor() {
    super({
      type: typeName,
      pluginMigrations: [],
      blockGroup: "data",
    });
  }

  create: createFn<ITextInterpolationNode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<ITextInterpolationNode>({
      type: this.type,
      version: this.version,
      pluginVersion: this.pluginVersion,
      yContent: createUnproxiedYRichTextFragment(),
      isFormatted: true,
      ...data,
    });
  };

  createVariable: createVariableFn<
    IRichTextVariable<TMainChildId> | ITextVariable<TMainChildId>,
    | {
        value: IRichTextVariable["value"];
        readableValue: string;
      }
    | ITextVariable["value"]
  > =
    ({ nodeId, execution = "unexecuted", value }) =>
    (treeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      let childVariable:
        | IRichTextVariable<TMainChildId>
        | ITextVariable<TMainChildId>
        | undefined = undefined;

      if (node.isFormatted && (value == null || typeof value !== "string")) {
        childVariable = RichTextVariable.create({
          execution,
          id: RecordVariable.createMainIdPath(nodeId),
          name: "Textkombination",
          value: value?.value,
          readableValue: value?.readableValue,
        });
      }

      if (!node.isFormatted && (value == null || typeof value === "string")) {
        childVariable = TextVariable.create({
          execution,
          id: RecordVariable.createMainIdPath(nodeId),
          name: "Textkombination",
          value,
        });
      }

      if (!childVariable) {
        const expectedRichText = node.isFormatted;

        throw new FatalError({
          code: "type_mismatch",
          debugMessage: `Expected ${
            expectedRichText ? "rich text" : "plain text"
          } value, but got ${expectedRichText ? "plain text" : "rich text"}.`,
        });
      }

      return {
        variable: RecordVariable.create({
          id: nodeId,
          name: node.name,
          status: "ok",
          execution,
          value: {
            [RecordVariable.createChildIdPath(nodeId, nodeId)]: childVariable,
          },
        }),
      };
    };

  getDescription = (node: ITextInterpolationNode) => () => {
    return `Block ${node.name} is of type ${node.type}.`;
  };
}

export const TextInterpolationNode = new TextInterpolationPlugin();
