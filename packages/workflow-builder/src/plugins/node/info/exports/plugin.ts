import type { XmlFragment } from "yjs";
import { createUnproxiedYRichTextFragment } from "../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type { TNodeId } from "../../../../tree/id";
import {
  type INode,
  NodePlugin,
  type createFn,
  type createVariableFn,
} from "../../../../tree/type/plugin/NodePlugin";
import type { TTreeClient } from "../../../../tree/type/treeClient";
import { convertContentToYContent } from "../../shared/convertContentToYContent";

export const typeName = "info" as const;

export interface IInfoNode extends INode<typeof typeName> {
  yContent: XmlFragment;
}

export class InfoNodePlugin extends NodePlugin<IInfoNode> {
  readonly hasAction = false;
  readonly hasRenderer = true;
  readonly hasWebhook = false;
  readonly hasSidebar = true;
  readonly hasCanvasNode = true;

  override isAddable = () => true;

  description =
    "Ein Infoblock ist ein Block, der Informationen für den Nutzer enthält. Er wird verwendet um über etwas zu informieren. Er produziert keine Variable.";

  constructor() {
    super({
      type: typeName,
      pluginMigrations: [convertContentToYContent("content", "yContent")],
      blockGroup: "structure",
    });
  }

  create: createFn<IInfoNode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<IInfoNode>({
      type: this.type,
      version: this.version,
      pluginVersion: this.pluginVersion,
      yContent: createUnproxiedYRichTextFragment(data?.content),
      ...data,
    });
  };

  createVariable: createVariableFn<never> =
    ({ nodeId, execution = "unexecuted" }) =>
    (treeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      return {
        variable: treeClient.nodes.create.variable(node, {
          execution,
          value: [],
        }),
      };
    };

  getDescription = (node: IInfoNode) => () => {
    return `Block ${node.name} is of type ${node.type}.`;
  };

  updateRendererButtonLabel =
    (nodeId: TNodeId, newLabel?: string) => (treeClient: TTreeClient) => {
      const node = treeClient.nodes.get.single<
        INode & { rendererButtonLabel?: string }
      >(nodeId);

      if (!newLabel) {
        node.rendererButtonLabel = undefined;
      }

      node.rendererButtonLabel = newLabel;
    };
}

export const InfoNode = new InfoNodePlugin();
