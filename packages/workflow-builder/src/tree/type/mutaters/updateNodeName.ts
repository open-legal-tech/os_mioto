import type { TNodeId } from "../../id";
import { getNodeSingle } from "../getters/getNodeSingle";
import type { TTree } from "../type-classes/Tree";

export const updateNodeName =
  (tree: TTree) => (nodeId: TNodeId, name: string) => {
    const node = getNodeSingle(tree)(nodeId);

    if (!node) return;

    node.name = name;
  };
