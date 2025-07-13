import { Failure } from "@mioto/errors";
import type { IEdge } from "../plugin/EdgePlugin";
import type { TTree } from "../type-classes/Tree";
import { isCircular } from "../utils/isCircular";

export type EdgeCreationRules = {
  duplicate?: boolean;
  selfConnection?: boolean;
  circular?: boolean;
};

/**
 * Validates an edge object based on the full tree.
 * An Edge cannot be:
 * 1. A duplicate
 * 2. A circular connection
 * @param tree the full tree
 */
export const isValidEdge =
  (tree: TTree) =>
  (
    { source, target }: Omit<IEdge, "id">,
    {
      circular = true,
      duplicate = true,
      selfConnection = true,
    }: EdgeCreationRules = {
      circular: true,
      duplicate: true,
      selfConnection: true,
    },
  ) => {
    // Make sure the edge does not connect the node to itself.
    if (selfConnection && source === target)
      return new Failure({
        code: "connected_to_self",
      });

    // Only validate edges with targets.
    if (!target) return true;

    // // Make sure the edge does not already exist based on the combination of source and target.
    if (
      duplicate &&
      tree.edges &&
      Object.values(tree.edges).find(
        (existingEdge) =>
          existingEdge.target &&
          existingEdge.source === source &&
          existingEdge.target === target,
      )
    ) {
      return new Failure({
        code: "duplicate_edge",
      });
    }

    // Make sure the edge does not result in a circular connection.
    if (circular && isCircular(tree)({ source, target }))
      return new Failure({
        code: "circular_connection",
      });

    return true;
  };
