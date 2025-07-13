import { isEmpty } from "remeda";
import { fromEntries } from "remeda";
import type { TEdgeId } from "../../id";
import type { IEdge } from "../plugin/EdgePlugin";
import type { TTree } from "../type-classes/Tree";
import { getEdgeSingle } from "./getEdgeSingle";

export const getEdgeMany =
  (tree: TTree) =>
  <TType extends IEdge>(ids: TEdgeId[], type?: TType["type"]) => {
    const edges = fromEntries(
      ids.map((id) => [id, getEdgeSingle(tree)(id, type)]),
    );

    if (isEmpty(edges)) return undefined;

    return edges as Record<string, TType>;
  };
