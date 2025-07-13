import type { TNodeId } from "../../id";
import { getNodeSingle } from "../getters/getNodeSingle";
import type { TTree } from "../type-classes/Tree";

export const updateStartNode = (tree: TTree) => (startNode: TNodeId) => {
  // We only get the node to make sure it exists.
  getNodeSingle(tree)(startNode);

  tree.startNode = startNode;
};
