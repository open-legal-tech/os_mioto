import type { IEdge } from "../plugin/EdgePlugin";
import type { TTree } from "../type-classes/Tree";

/**
 * Used to transform an existing edge into another.
 */
export const transformEdge =
  (_: TTree) =>
  <TType extends IEdge>(
    edge: IEdge,
    data: Omit<TType, "id" | "source" | "target">,
  ) => {
    return {
      ...data,
      source: edge.source,
      target: edge.target,
      id: edge.id,
    } as TType;
  };
