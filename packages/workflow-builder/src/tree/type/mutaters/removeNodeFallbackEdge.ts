import type { TNodeId } from "../../id";
import { getNodeSingle } from "../getters/getNodeSingle";
import type { TTree } from "../type-classes/Tree";

export const removeNodeFallbackEdge = (tree: TTree) => (nodeId: TNodeId) => {
  const node = getNodeSingle(tree)(nodeId);

  if (node.fallbackEdge) {
    node.edges.push(node.fallbackEdge);
    node.fallbackEdge = undefined;
  }
};
