import { TreeEvent } from "../TreeEventEmitter";
import type { INode } from "../plugin/NodePlugin";
import type { TTree } from "../type-classes/Tree";

/**
 * Always adds a new Node to the tree. There are no rules so this
 * will never fail. If there is no startNode the node is assigned
 * as the startNode.
 *
 * @param node to be added to the tree
 */
export const addNode = (tree: TTree) => (node: INode) => {
  const isSystemNode = node.type.includes("system");
  if (!tree.nodes) tree.nodes = {};

  tree.nodes[node.id] = node;

  if (!tree.startNode && !isSystemNode) {
    tree.startNode = node.id;
    TreeEvent.emit("updateStartNode", { startNodeId: node.id });
  }

  TreeEvent.emit("addNode", { nodeId: node.id });
};
