import type { TTree } from "../type-classes/Tree";
import { getNodeAll } from "./getNodeAll";

export const getNodeByName = (tree: TTree) => (name: string) => {
  const nodes = Object.values(getNodeAll(tree)());

  return nodes.find((node) => node.name === name);
};
