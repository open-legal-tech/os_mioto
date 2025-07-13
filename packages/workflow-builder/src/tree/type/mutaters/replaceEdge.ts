import type { TEdgeId } from "../../id";
import type { IEdge } from "../plugin/EdgePlugin";
import type { TTree } from "../type-classes/Tree";

export const replaceEdge =
  (tree: TTree) => (edgeId: TEdgeId, newEdge: IEdge) => {
    tree.edges[edgeId] = { ...newEdge, id: edgeId };
  };
