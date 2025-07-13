import type { TEdgeId, TNodeId } from "../../id";
import { getNodeSingle } from "../getters/getNodeSingle";
import type { TTree } from "../type-classes/Tree";

export const addEdgeToNode =
  (tree: TTree) => (nodeId: TNodeId, edgeId: TEdgeId) => {
    const node = getNodeSingle(tree)(nodeId);

    node.edges.push(edgeId);
  };
