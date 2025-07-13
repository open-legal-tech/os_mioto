
import { z } from "zod";
import { CompareEdge } from "../plugins/edge/compare/plugin";
import { ComplexLogicEdge } from "../plugins/edge/complex-logic/exports/plugin";
import { ZComplexLogicEdge } from "../plugins/edge/complex-logic/exports/type";
import { DirectEdge } from "../plugins/edge/direct/plugin";
import { AINode } from "../plugins/node/ai/exports/plugin";
import { ZAINode } from "../plugins/node/ai/exports/type";
import { AuthenticationNode } from "../plugins/node/authentication/exports/plugin";
import { ZAuthenticationNode } from "../plugins/node/authentication/exports/type";
import { CalculationNode } from "../plugins/node/calculation/plugin";
import { ZCalculationNode } from "../plugins/node/calculation/type";
import { DocumentNode } from "../plugins/node/document/plugin";
import { DocumentNode as DocumentNodeV2 } from "../plugins/node/documentv2/plugin";
import { ZDocumentNodeV2 } from "../plugins/node/documentv2/type";
import { DecisionNode } from "../plugins/node/form/depreceated_DecisionNode/plugin";
import { FormNode } from "../plugins/node/form/exports/plugin";
import { ZFormNode } from "../plugins/node/form/exports/type";
import { GlobalVariablesNode } from "../plugins/node/global-variables/plugin";
import { ZGlobalVariablesNode } from "../plugins/node/global-variables/type";
import { InfoNode } from "../plugins/node/info/exports/plugin";
import { ZInfoNode } from "../plugins/node/info/exports/type";
import { LogicNode } from "../plugins/node/logic/plugin";
import { ZLogicNode } from "../plugins/node/logic/type";
import { PlaceholderNode } from "../plugins/node/placeholder/plugin";
import { ReportingNode } from "../plugins/node/reporting/plugin";
import { ZReportingNode } from "../plugins/node/reporting/type";
import { TextInterpolationNode } from "../plugins/node/text-interpolation/plugin";
import { ZTextInterpolationNode } from "../plugins/node/text-interpolation/type";
import type { IEdge, INode } from "./exports/types";
import type { TTreeClient } from "./type/treeClient";
import { TreeType } from "./type/type-classes/Tree";

const nodePlugins = {
  [TextInterpolationNode.type]: TextInterpolationNode,
  [InfoNode.type]: InfoNode,
  [PlaceholderNode.type]: PlaceholderNode,
  [ReportingNode.type]: ReportingNode,
  [DecisionNode.type]: DecisionNode,
  [FormNode.type]: FormNode,
  [DocumentNodeV2.type]: DocumentNodeV2,
  [DocumentNode.type]: DocumentNode,
  [CalculationNode.type]: CalculationNode,
  [AuthenticationNode.type]: AuthenticationNode,
  [GlobalVariablesNode.type]: GlobalVariablesNode,
  [AINode.type]: AINode,
  [LogicNode.type]: LogicNode,
};

const edgePlugins = {
  [DirectEdge.type]: DirectEdge,
  [ComplexLogicEdge.type]: ComplexLogicEdge,
  [CompareEdge.type]: CompareEdge,
};

export const createTreeClientPlugins = (treeClient: TTreeClient) => {
  const NodeType = z.discriminatedUnion("type", [
    ZTextInterpolationNode(treeClient),
    ZDocumentNodeV2(treeClient),
    ZInfoNode(treeClient),
    ZFormNode(treeClient),
    ZReportingNode(treeClient),
    ZLogicNode(treeClient),
    ZCalculationNode(treeClient),
    ZAuthenticationNode(treeClient),
    ZGlobalVariablesNode(treeClient),
    ZAINode(treeClient),
  ]);

  const EdgeType = ZComplexLogicEdge(treeClient);

  const ExtendedTreeType = TreeType.extend({
    edges: z.record(EdgeType),
    nodes: z.record(NodeType),
  });

  ComplexLogicEdge.setNodePlugins(nodePlugins);

  return {
    nodePlugins,
    edgePlugins,
    EdgeType,
    NodeType,
    TreeType: ExtendedTreeType,
  };
};

export type TTreeClientWithPlugins = ReturnType<typeof createTreeClientPlugins>;

export type TNodePlugins = TTreeClientWithPlugins["nodePlugins"];
export type TEdgePlugins = TTreeClientWithPlugins["edgePlugins"];
export type TNodeType = z.infer<TTreeClientWithPlugins["NodeType"]>;
export type TEdgeType = z.infer<TTreeClientWithPlugins["EdgeType"]>;
export type TTreeType = z.infer<TTreeClientWithPlugins["TreeType"]>;

export function assertNode(node: INode): asserts node is TNodeType {
  if (!(node.type in nodePlugins)) {
    throw new Error(`Node type not found in plugins.`);
  }
}

export function assertNodeType(
  type: string,
): asserts type is TNodeType["type"] {
  if (!(type in nodePlugins)) {
    throw new Error(`Node type not found in plugins.`);
  }
}

export function assertEdge(edge: IEdge): asserts edge is TEdgeType {
  if (!(edge.type in edgePlugins)) {
    throw new Error(`Edge type not found in plugins.`);
  }
}
