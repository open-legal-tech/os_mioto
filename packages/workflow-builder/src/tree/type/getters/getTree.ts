import type { TTree } from "../type-classes/Tree";

export const getTree = (tree: TTree) => () => {
  return tree;
};
