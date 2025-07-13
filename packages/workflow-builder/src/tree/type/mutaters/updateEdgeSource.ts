import type { TEdgeId, TNodeId } from "../../id";
import { getEdgeSingle } from "../getters/getEdgeSingle";
import type { TTree } from "../type-classes/Tree";

export const updateEdgeSource =
  (tree: TTree) => (edgeId: TEdgeId, newSource: TNodeId) => {
    const edge = getEdgeSingle(tree)(edgeId);

    if (!edge) return;

    edge.source = newSource;
  };
