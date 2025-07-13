import { partition } from "remeda";
import { getEdgesByNode } from "../../getters/getEdgesByNode";
import type { entityMigrationFunction } from "../createMigrationFn";

export const addEdgesProperty: entityMigrationFunction =
  (tree) => async (node) => {
    console.log(`Add edges property to node ${node.id}`);
    const [directEdges, otherEdges] = partition(
      Object.values(getEdgesByNode(tree)(node.id)?.source ?? {}),
      (edge) => edge.type === "direct",
    ).map((edges) => edges.map((edge) => edge.id));

    node.edges = otherEdges;

    node.fallbackEdge = directEdges?.[0];
  };
