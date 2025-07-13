import type { TNodeId } from "../../id";
import type { INode } from "../plugin/NodePlugin";
import type { TTree } from "../type-classes/Tree";

export const hasNode =
  (tree: TTree) =>
  <TType extends INode>(nodeId: TNodeId, type?: TType["type"]) => {
    return type
      ? !!tree?.nodes?.[nodeId] && tree.nodes[nodeId]?.type === type
      : !!tree?.nodes?.[nodeId];
  };
