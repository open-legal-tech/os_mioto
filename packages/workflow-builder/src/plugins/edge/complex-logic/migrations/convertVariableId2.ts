import type { pluginMigrationFn } from "../../../../tree/type/migrations/createPluginMigration";
import type { IComplexLogicEdge } from "../exports/plugin";

/**
 * Initially we stored the childId differently in the complex logic edge.
 */
export const convertVariableId2: pluginMigrationFn<IComplexLogicEdge> =
  () => async (edge) => {
    edge.conditions.forEach((condition) => {
      if (Array.isArray(condition[0].variablePath)) {
        console.log(
          `Migrating ${edge.id} by converting the conditions variable path array into a string.`,
        );

        condition[0].variablePath = condition[0].variablePath[1] as any;
      }
    });
  };
