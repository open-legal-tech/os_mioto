import { filter, map, pipe, values } from "remeda";
import type { TNodeId } from "../../id";
import type { TTree } from "../type-classes/Tree";

/**
 * Get the immediate Children of the node with the provided id.
 */
export const getChildren = (tree: TTree) => (nodeId: TNodeId) => {
  if (!tree.edges) return [];

  return pipe(
    tree.edges,
    (x) => values(x),
    // Filter out relations without targets
    filter((edge) => edge.source === nodeId),
    // Return an array of the target ids
    map((edge) => edge.target),
  );
};
