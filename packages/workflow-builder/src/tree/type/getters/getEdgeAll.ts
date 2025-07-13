import type { TTree } from "../type-classes/Tree";

export const getEdgeAll = (tree: TTree) => () => {
  return tree.edges;
};
