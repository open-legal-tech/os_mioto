import type { pluginMigrationFn } from "../../../../tree/type/migrations/createPluginMigration";
import type { INode } from "../../../../tree/type/plugin/NodePlugin";

export const removePlaceholderNode: pluginMigrationFn<INode> =
  (treeClient) => async (node) => {
    console.log(`Migrating ${node.id} by deleting this placeholder node.`);

    treeClient.nodes.delete([node.id]);
  };
