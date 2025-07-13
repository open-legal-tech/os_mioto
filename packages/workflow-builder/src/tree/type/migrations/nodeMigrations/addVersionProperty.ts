import type { entityMigrationFunction } from "../createMigrationFn";

export const addNodeVersionProperty: entityMigrationFunction =
  (_) => async (node) => {
    console.log(`Add node version property to node ${node.id}`);
    node.version = 1;
    node.pluginVersion = 1;
  };
