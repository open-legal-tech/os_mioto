import type { TEdgeId } from "../../id";
import { getEdgeSingle } from "../getters/getEdgeSingle";
import type { IEdge } from "../plugin/EdgePlugin";
import type { TTree } from "../type-classes/Tree";

export const updateEdge =
  (tree: TTree) => (edgeId: TEdgeId, newEdge: Partial<IEdge>) => {
    const edge = getEdgeSingle(tree)(edgeId);

    tree.edges[edgeId] = { ...edge, ...newEdge, id: edgeId };
  };
