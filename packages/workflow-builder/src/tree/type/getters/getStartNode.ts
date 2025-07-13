import type { TTree } from "../type-classes/Tree";

export const getStartNodeId = (tree: TTree) => {
  return tree.startNode;
};
