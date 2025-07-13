import type { TNodeId } from "../../id";
import type { INode } from "../plugin/NodePlugin";
import type { TTree } from "../type-classes/Tree";

export const updateNode =
  (tree: TTree) =>
  <TNode extends INode>(nodeId: TNodeId, newNode: TNode) => {
    const nodes = tree.nodes;

    nodes[nodeId] = { ...newNode, id: nodeId };
  };
