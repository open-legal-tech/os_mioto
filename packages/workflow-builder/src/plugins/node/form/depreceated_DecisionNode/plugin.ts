import { forEachObj } from "remeda";
import type { TRichText } from "../../../../rich-text-editor/exports/types";
import type { TNodeId } from "../../../../tree/id";
import {
  type INode,
  NodePlugin,
  type createFn,
  type createVariableFn,
} from "../../../../tree/type/plugin/NodePlugin";
import type {
  TReadOnlyTreeClient,
  TTreeClient,
} from "../../../../tree/type/treeClient";
import type { ISelectVariable } from "../../../../variables/exports/types";
import type { TInputId } from "../inputs/InputPlugin";
import { convertToFormNode } from "./migrations/convertToFormNode";

export type TDecisionNodeVariable = ISelectVariable;

export const typeName = "decision" as const;

export interface IDecisionNode extends INode<typeof typeName> {
  content?: TRichText;
  input?: TInputId;
}

export class DecisionNodePlugin extends NodePlugin<IDecisionNode> {
  override isAddable = () => {
    return false;
  };
  readonly hasAction = false;
  readonly hasRenderer = false;
  readonly hasWebhook = false;
  readonly hasSidebar = false;
  readonly hasCanvasNode = false;

  constructor() {
    super({
      type: typeName,
      pluginMigrations: [convertToFormNode],
      blockGroup: "data",
    });
  }

  create: createFn<IDecisionNode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<IDecisionNode>({
      type: this.type,
      version: this.version,
      pluginVersion: this.pluginVersion,
      ...data,
    });
  };

  updateInput =
    (nodeId: TNodeId, newInputId: TInputId) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      node.input = newInputId;
    };

  updateNodeContent =
    (nodeId: TNodeId, content: IDecisionNode["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      node.content = content;
    };

  override delete = (ids: TNodeId[]) => (treeClient: TTreeClient) => {
    const nodes = this.getCollection(ids)(treeClient);

    if (!nodes) return;

    treeClient.nodes.delete(ids);

    forEachObj(nodes, (_, id) => {
      const edges = treeClient.edges.get.byNode(id);
      treeClient.edges.delete(
        [
          ...Object.values(edges?.source ?? {}),
          ...Object.values(edges?.target ?? {}),
        ]
          .filter((edge) => edge.source === id || edge.target === id)
          .map((edge) => edge.id),
      );
    });
  };

  getVariable =
    (nodeId: TNodeId, answers: any) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const variable = this.createVariable({ nodeId })(treeClient).variable;

      if (!variable) return undefined;

      return answers[variable.escapedName] as TDecisionNodeVariable;
    };

  createVariable: createVariableFn<TDecisionNodeVariable> =
    ({ nodeId }) =>
    (treeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      return {
        variable: treeClient.nodes.create.variable(node, {
          execution: "unexecuted",
          value: [],
        }),
      };
    };
}

export const DecisionNode = new DecisionNodePlugin();
