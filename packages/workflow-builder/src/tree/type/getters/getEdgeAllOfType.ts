import { pickBy } from "remeda";
import type { IEdge } from "../plugin/EdgePlugin";
import type { TTree } from "../type-classes/Tree";

export const getEdgeAllOfType =
  (tree: TTree) =>
  <TType extends IEdge>(type?: TType["type"]) => {
    return pickBy(tree.edges, (edge) => edge.type === type) as Record<
      string,
      TType
    >;
  };
