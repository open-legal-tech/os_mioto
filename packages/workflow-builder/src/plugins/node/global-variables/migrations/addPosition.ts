import type { pluginMigrationFn } from "../../../../tree/type/migrations/createPluginMigration";
import type { IGlobalVariablesNode } from "../plugin";

export const addPosition: pluginMigrationFn<IGlobalVariablesNode> =
  (_) => async (node) => {
    console.log(`Migrating ${node.id} by adding the position property.`);

    node.position = { x: 0, y: 0 };
  };
