import { pipe, reduce, unique, values } from "remeda";
import type { TNodeId } from "../../id";
import type { TTree } from "../type-classes/Tree";

/**
 * Get the immediate parents of the node with the provided id.
 */
export const getParents = (tree: TTree) => (nodeId: TNodeId) => {
  if (!tree.edges) return [];

  return pipe(
    tree.edges,
    (x) => values(x),
    // Reduce the edges with the provided node id as a target to an array
    reduce((acc: string[], edge) => {
      if (edge.target === nodeId) return [...acc, edge.source];

      return acc;
    }, []),
    // Remove duplicates
    unique(),
  );
};
