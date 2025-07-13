import type { pluginMigrationFn } from "../../../../tree/type/migrations/createPluginMigration";

export const addSendToAccount: pluginMigrationFn<any> = () => async (node) => {
  node.sendToAccount = false;
};
