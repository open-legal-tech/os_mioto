import type { TEdgeId } from "../../id";
import { getEdgeSingle } from "../getters/getEdgeSingle";
import { hasEdge } from "../getters/hasEdge";
import type { TTree } from "../type-classes/Tree";
import { removeEdgeFromNode } from "./removeEdgeFromNode";

export const deleteEdges = (tree: TTree) => (ids: TEdgeId[]) => {
  ids.forEach((id) => {
    if (hasEdge(tree)(id)) {
      const edge = getEdgeSingle(tree)(id);

      removeEdgeFromNode(tree)(edge.source, id);
    }

    delete tree.edges[id];
  });
};
