import { values } from "remeda";
import type { TNodeId } from "../../id";
import { getNodeSingle } from "../getters/getNodeSingle";
import type { INode } from "../plugin/NodePlugin";
import type { TTree } from "../type-classes/Tree";
import { createNode } from "./createNode";

export const createChildNode =
  (tree: TTree) =>
  <TNodeType extends INode>(nodeId: TNodeId, newNode: TNodeType) => {
    // Get the node we want the children for
    const node = getNodeSingle(tree)(nodeId);

    // Fitler the edges to only include the ones with the given node as the source
    const numberOfEdges = values(tree.edges ?? {}).filter((edge) => {
      return edge.target && edge.source === nodeId;
    }).length;

    // The new node position is somewhat displaced from the parent node
    const position = {
      x: node.position.x + 280 * (numberOfEdges - 1),
      y: node.position.y + 200,
    };

    return createNode(tree)({
      ...newNode,
      position,
    });
  };
