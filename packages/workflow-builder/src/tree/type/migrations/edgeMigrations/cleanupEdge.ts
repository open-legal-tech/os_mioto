import { getNodeSingle } from "../../getters/getNodeSingle";
import { hasNode } from "../../getters/hasNode";
import { deleteEdges } from "../../mutaters/deleteEdges";
import type { entityMigrationFunction } from "../createMigrationFn";

export const cleanupEdge: entityMigrationFunction = (tree) => async (edge) => {
  if (hasNode(tree)(edge.source)) {
    const sourceNode = getNodeSingle(tree)(edge.source);

    if (
      sourceNode.edges.includes(edge.id) ||
      sourceNode.fallbackEdge === edge.id
    ) {
      return;
    }
  }

  deleteEdges(tree)([edge.id]);
};
