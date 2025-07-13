import { mapValues } from "remeda";
import type { NodePlugin } from "../tree/type/plugin/NodePlugin";
import type { TReadOnlyTreeClient, TTreeClient } from "../tree/type/treeClient";

export function getVariables(
  treeClient: TReadOnlyTreeClient | TTreeClient,
  nodePlugins: Record<string, NodePlugin>,
) {
  const nodes = treeClient.nodes.get.all({ includeSystem: true });

  return mapValues(nodes, (node) => {
    const plugin = nodePlugins[node.type];

    if (!plugin) {
      throw new Error(`Editor plugin of type ${node.type} not found.`);
    }
    return plugin.createVariable({
      nodeId: node.id,
      execution: "unexecuted",
    })(treeClient).variable;
  });
}
