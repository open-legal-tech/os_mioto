import type { TEdgeId } from "../../id";
import type { IEdge } from "../plugin/EdgePlugin";
import type { TTree } from "../type-classes/Tree";

export const hasEdge =
  (tree: TTree) =>
  <TType extends IEdge>(edgeId: TEdgeId, type?: TType["type"]) =>
    type
      ? !!tree.edges[edgeId] && tree.edges[edgeId]?.type === type
      : !!tree.edges[edgeId];
