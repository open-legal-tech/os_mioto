import { pickBy } from "remeda";
import type { TTree } from "../type-classes/Tree";

export const getNodeAll =
  (tree: TTree) =>
  (
    { includeSystem }: { includeSystem: boolean } = { includeSystem: false },
  ) => {
    return pickBy(tree.nodes, (node) => {
      if (node.type.includes("system")) return includeSystem && !node.isRemoved;

      return !node.isRemoved;
    });
  };
