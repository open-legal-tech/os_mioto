import { InvalidTreeDataError } from "../errors/commonErrors";
import { getNodeSingle } from "../getters/getNodeSingle";
import type { IEdge } from "../plugin/EdgePlugin";
import type { TTree } from "../type-classes/Tree";
import { isValidEdge } from "../validators/isValidEdge";

/**
 * @summary Adds an edge to the tree under certain conditions.
 * @description
 * This functions adds a new edge if the following conditions are true:
 * - Does not connect to itself
 * - Edge does not already exist
 * - The Edge would not result in a circularly connected tree
 *
 * @param edge to be added to the tree
 */
export const addEdge = (tree: TTree) => (edge: IEdge, isDirect?: boolean) => {
  if (!tree.edges) tree.edges = {};

  if (!isValidEdge(tree)(edge)) throw InvalidTreeDataError("edge");

  tree.edges[edge.id] = edge;

  const node = getNodeSingle(tree)(edge.source);

  if (isDirect) {
    node.fallbackEdge = edge.id;
  } else {
    node.edges.push(edge.id);
  }

  return { success: true };
};
