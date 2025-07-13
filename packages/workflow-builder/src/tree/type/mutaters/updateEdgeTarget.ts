import type { TEdgeId, TNodeId } from "../../id";
import { getEdgeSingle } from "../getters/getEdgeSingle";
import type { TTree } from "../type-classes/Tree";

export const updateEdgeTarget =
  (tree: TTree) => (edgeId: TEdgeId, newTarget: TNodeId) => {
    const edge = getEdgeSingle(tree)(edgeId);
    edge.target = newTarget;

    return { success: true };
  };
