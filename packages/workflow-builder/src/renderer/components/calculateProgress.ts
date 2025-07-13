import type { TNodeId } from "../../tree/id";
import type { NodePlugin } from "../../tree/type/plugin/NodePlugin";
import type { TreeClient } from "../../tree/type/treeClient";

export const calculateProgress = (
  treeClient: TreeClient,
  nodePlugins: Record<string, NodePlugin>,
  startNodeId: TNodeId,
) => {
  const filterRelevantNodes = (nodeId: TNodeId) => {
    if (!treeClient) return false;
    const node = treeClient.nodes.get.single(nodeId);
    return nodePlugins[node.type]?.hasRenderer ?? false;
  };

  const pathsFromStart = treeClient.nodes.get.longestPathFrom(
    startNodeId,
    filterRelevantNodes,
  );

  return function getCurrentNodeProgress(nodeId: TNodeId) {
    if (!treeClient) return 0;
    const longestPath = treeClient.nodes.get.longestPathFrom(
      nodeId,
      filterRelevantNodes,
    );

    return Math.floor((1 - (longestPath - 1) / pathsFromStart) * 100);
  };
};
