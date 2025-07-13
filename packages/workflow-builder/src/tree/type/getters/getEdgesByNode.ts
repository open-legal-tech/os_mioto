import { forEachObj, isEmpty } from "remeda";
import type { TEdgeId, TNodeId } from "../../id";
import type { IEdge } from "../plugin/EdgePlugin";
import type { TTree } from "../type-classes/Tree";
import { getEdgeSingle } from "./getEdgeSingle";

const isEdgeOfType = <TType extends IEdge>(
  edge: TType,
  type: string,
): edge is TType => edge.type === type;

export const getEdgesByNode =
  (tree: TTree) =>
  <TType extends IEdge>(nodeId: TNodeId, type?: string) => {
    if (!tree.edges) return undefined;

    // We loop over the edges and check if the node is present on the edge.
    const relatedEdges: Record<
      "source" | "target",
      Record<TEdgeId, TType> | undefined
    > = {
      /**
       * This groups the edges that have the node as a source.
       */
      source: undefined,
      /**
       * This groups the edges that have the node as a target.
       */
      target: undefined,
    };

    forEachObj(tree.edges, (_, key) => {
      const edge = getEdgeSingle(tree)<TType>(key);

      if (!edge) return;

      if (type ? isEdgeOfType(edge, type) : true) {
        if (edge.source === nodeId) {
          if (!relatedEdges.source) relatedEdges.source = {};
          relatedEdges.source[key] = edge;
        }
        if (edge.target === nodeId) {
          if (!relatedEdges.target) relatedEdges.target = {};

          relatedEdges.target[key] = edge;
        }
      }
    });

    // If the resulting conditions are empty we return undefined, because it is more meaningful and
    // easier to handle downstream.
    if (
      (!relatedEdges.source || isEmpty(relatedEdges.source)) &&
      (!relatedEdges.target || isEmpty(relatedEdges.target))
    )
      return undefined;

    return relatedEdges;
  };
