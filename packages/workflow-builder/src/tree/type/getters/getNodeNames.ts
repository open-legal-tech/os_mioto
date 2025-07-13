import { mapValues } from "remeda";
import { omitBy } from "remeda";
import { pick } from "remeda";
import type { TNodeId } from "../../id";
import type { INode } from "../plugin/NodePlugin";
import type { TTree } from "../type-classes/Tree";
import { getNodeAll } from "./getNodeAll";

const nodeWithName = (node: {
  id: TNodeId;
  name?: string;
}): node is { id: TNodeId; name: string } => {
  return typeof node.name === "string";
};

/**
 *  Gets the nodes of the provided ids with their name.
 * @param ids the ids of the nodes to get. If none are provided, all nodes are returned.
 * @param fallbackName used as the name if the node does not have one. If not provided a node without
 * a name will be omitted from the result.
 */
export const getNodeNames =
  (tree: TTree) => (ids?: TNodeId[], fallbackName?: string) => {
    if (!tree.nodes) return {};

    // map all the nodes into the desired shape. If the node does not have a name, use the fallback.
    const nodes = mapValues(getNodeAll(tree)(), (node) => ({
      id: node.id,
      name: node.name ?? fallbackName,
      data: node,
    }));

    // Filter out all the nodes without a name.
    const nodesWithNames = omitBy(nodes, (node) => !nodeWithName(node));

    // If no ids are provided, return all the nodes with names.
    return (ids ? pick(nodesWithNames, ids) : nodesWithNames) as Record<
      TNodeId,
      { id: TNodeId; name: string; data: INode }
    >;
  };
