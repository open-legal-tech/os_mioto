import type { TEdgeId, TNodeId } from "../../id";
import { getNodeSingle } from "../getters/getNodeSingle";
import type { TTree } from "../type-classes/Tree";

export const updateNodeFallbackEdge =
  (tree: TTree) => (nodeId: TNodeId, edgeId: TEdgeId) => {
    const node = getNodeSingle(tree)(nodeId);

    node.edges.splice(node.edges.indexOf(edgeId), 1);

    if (node.fallbackEdge) {
      node.edges.push(node.fallbackEdge);
    }

    node.fallbackEdge = edgeId;
  };
