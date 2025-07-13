import { Failure } from "@mioto/errors";
import { v4 as uuid } from "uuid";
import type { IEdge } from "../plugin/EdgePlugin";
import type { TTree } from "../type-classes/Tree";
import { type EdgeCreationRules, isValidEdge } from "../validators/isValidEdge";

/**
 * Used to create a valid new edge. This needs the full tree to make sure the edge is valid.
 */
export const createEdge =
  (tree: TTree) =>
  <TEdgeType extends IEdge>(
    edge: Omit<TEdgeType, "id">,
    rules?: EdgeCreationRules,
  ) => {
    // Create the edge object
    const newEdge = {
      id: `edge_${uuid()}`,
      ...edge,
    } satisfies IEdge;

    // Validate the created edge object, based on the rest of the tree.
    const isEdgeValid = isValidEdge(tree)(newEdge, rules);

    if (isEdgeValid instanceof Failure) return isEdgeValid;

    return newEdge;
  };
