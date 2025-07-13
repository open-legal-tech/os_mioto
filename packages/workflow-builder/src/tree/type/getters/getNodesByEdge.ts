import type { TEdgeId } from "../../id";
import type { TTree } from "../type-classes/Tree";
import { getEdgeSingle } from "./getEdgeSingle";
import { getNodeSingle } from "./getNodeSingle";

/**
 * Provide an edge id and receive the nodes that are related to it.
 * Returns undefined if there are no nodes.
 */
export const getNodesByEdge = (tree: TTree) => (edgeId: TEdgeId) => {
  const edge = getEdgeSingle(tree)(edgeId);
  if (!edge) return undefined;

  const source = getNodeSingle(tree)(edge.source);
  const target = edge?.target ? getNodeSingle(tree)(edge.target) : undefined;

  return { source, target };
};
