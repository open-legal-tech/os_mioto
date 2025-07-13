import type { TEdgeId, TNodeId } from "../../id";
import { getNodeSingle } from "../getters/getNodeSingle";
import { hasNode } from "../getters/hasNode";
import type { INode } from "../plugin/NodePlugin";
import type { TTree } from "../type-classes/Tree";

export const removeEdgeFromNode =
  (tree: TTree) => (nodeId: TNodeId, edgeId: TEdgeId) => {
    if (!hasNode(tree)(nodeId)) return;
    const node = getNodeSingle(tree)<INode>(nodeId);

    const edgeIndex = node.edges.indexOf(edgeId);
    if (edgeIndex >= 0) {
      node.edges.splice(edgeIndex, 1);
    } else if (node.fallbackEdge === edgeId) {
      node.fallbackEdge = undefined;
    }
  };
