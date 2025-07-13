import type { pluginMigrationFn } from "../../../../tree/type/migrations/createPluginMigration";
import type { IReportingNode } from "../plugin";

export const migrateAttachementVariable: pluginMigrationFn<IReportingNode> =
  () => async (node) => {
    console.log(`Migrate attachements for ${node.id}`);
    const migratedAttachements = node.attachements.map(
      (attachment) => `${attachment}__${attachment}` as const,
    );

    node.attachements = migratedAttachements;
  };
