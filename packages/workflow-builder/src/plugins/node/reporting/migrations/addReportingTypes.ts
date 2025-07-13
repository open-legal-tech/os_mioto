import type { pluginMigrationFn } from "../../../../tree/type/migrations/createPluginMigration";

export const addReportingTypes: pluginMigrationFn<any> = () => async (node) => {
  console.log("Migrating to variants for reporting node");

  node.variant = {};
  if (node.sendToAccount) {
    node.variant.type = "default";
  } else {
    node.variant.type = "custom";
    node.variant.recipientCustom = node.recipient;
  }

  node.recipient = undefined;
  node.sendToAccount = undefined;
};
