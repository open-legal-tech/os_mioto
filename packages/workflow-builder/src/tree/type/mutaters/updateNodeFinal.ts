import type { TNodeId } from "../../id";
import { getNodeSingle } from "../getters/getNodeSingle";
import type { TTree } from "../type-classes/Tree";

export const updateNodeFinal =
  (tree: TTree) => (nodeId: TNodeId, isFinal: boolean) => {
    const node = getNodeSingle(tree)(nodeId);

    node.final = isFinal;
  };
