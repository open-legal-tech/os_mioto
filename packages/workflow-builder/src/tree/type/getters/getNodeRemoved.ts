import { pickBy } from "remeda";
import type { TTree } from "../type-classes/Tree";

export const getNodeRemoved = (tree: TTree) => () => {
  return pickBy(tree.nodes, (node) => node.isRemoved ?? false);
};
