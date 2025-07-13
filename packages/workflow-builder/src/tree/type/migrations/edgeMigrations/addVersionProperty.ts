import type { entityMigrationFunction } from "../createMigrationFn";

export const addEdgeVersionProperty: entityMigrationFunction =
  (_) => async (edge) => {
    edge.version = 1;
    edge.pluginVersion = 1;
  };
