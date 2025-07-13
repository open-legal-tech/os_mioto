import type { TNodeId } from "../../tree/id";
import type { NodePlugin } from "../../tree/type/plugin/NodePlugin";
import type { TTreeClient } from "../../tree/type/treeClient";
import type { TModuleVariableValue } from "../../variables/dataTypes/ModuleVariable";
import { getCurrentNode } from "../exports/methods";

type Params = {
  context: TModuleVariableValue;
  treeClient: TTreeClient;
  nodePlugins: Record<string, NodePlugin>;
  direction: "forward" | "backward";
};

/**
 * This function walks back the history of the interpreter context and returns the id and position of the previous node.
 * It skips all actions, because they should be skipped when going back or forward.
 * If it does not find a node that is not an action it returns undefined.
 */
export function getNodePositionFromHistory({
  context,
  treeClient,
  nodePlugins,
  direction,
}: Params) {
  // If the currentNodeId is a final node we do not navigate anymore
  const currentNodeId = context.history.nodes[context.history.position]?.id;
  if (currentNodeId && treeClient.nodes.get.single(currentNodeId).final) {
    return undefined;
  }

  // We need the position and ids of the previous node.
  let nodePosition =
    direction === "backward"
      ? context.history.position + 1
      : context.history.position - 1;
  let nodeId: TNodeId | undefined = context.history.nodes[nodePosition]?.id;

  // This recursive function walks back in the history until it finds a node that is not an action.
  const walkHistory = (): TNodeId | undefined => {
    // If there is no previous node we return.
    if (!nodeId) return;

    // We get the node from the tree and check if it is should be included in the navigation.
    const node = treeClient.nodes.get.single(nodeId);
    const nodePlugin = nodePlugins[node.type];

    if (
      nodePlugin?.shouldIncludeInNavigation({
        variables: context.variables,
        node: getCurrentNode(treeClient, context),
      })
    ) {
      return nodeId;
    }

    // At this point we have determined that the previous node is an action.
    // So we assign the next node as the previous node and call the function again.
    if (direction === "backward") {
      nodePosition += 1;
    } else {
      nodePosition -= 1;
    }
    nodeId = context.history.nodes[nodePosition]?.id;

    return walkHistory();
  };

  // We call the recursive function.
  walkHistory();

  // If after walking back the history we do not have a previousNode we know that
  // only actions come before the current node. So we return undefined.
  if (!nodeId) return undefined;

  // If we have found a previousNode that is not an action we return the id and position.
  return { id: nodeId, position: nodePosition };
}
