import type { TNodeId } from "../../id";
import type { TTree } from "../type-classes/Tree";
import { getConnectableNodes } from "../utils/getConnectableNodes";
import { getEdgesByNode } from "./getEdgesByNode";
import { getNodeNames } from "./getNodeNames";

/**
 * Get the possible connectable options for a node.
 */
export const getNodeOptions = (tree: TTree) =>
  (function getNodeOptions(nodeId: TNodeId, fallbackName?: string) {
    const connectableNodes = getConnectableNodes(tree)(nodeId);
    const connectedNodes = Object.values(
      getEdgesByNode(tree)(nodeId)?.source ?? {},
    ).map((edge) => edge.target);

    const filteredNodes = connectableNodes.filter(
      (node) => !connectedNodes.includes(node),
    );

    return getNodeNames(tree)(filteredNodes, fallbackName);
  });
