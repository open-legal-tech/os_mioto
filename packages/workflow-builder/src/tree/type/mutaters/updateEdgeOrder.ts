import type { TEdgeId, TNodeId } from "../../id";
import { getNodeSingle } from "../getters/getNodeSingle";
import type { TTree } from "../type-classes/Tree";

export const updateEdgeOrder =
  (tree: TTree) => (nodeId: TNodeId, newEdgeOrder: TEdgeId[]) => {
    const node = getNodeSingle(tree)(nodeId);

    node.edges = newEdgeOrder;
  };
