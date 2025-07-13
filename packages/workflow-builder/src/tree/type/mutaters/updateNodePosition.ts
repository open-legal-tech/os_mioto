import type { TNodeId } from "../../id";
import { getNodeSingle } from "../getters/getNodeSingle";
import type { TCoordinates } from "../type-classes/Node";
import type { TTree } from "../type-classes/Tree";

export const updateNodePosition =
  (tree: TTree) => (nodeId: TNodeId, position: TCoordinates) => {
    const node = getNodeSingle(tree)(nodeId);

    if (!node) return;

    node.position.x = position.x;
    node.position.y = position.y;
  };
