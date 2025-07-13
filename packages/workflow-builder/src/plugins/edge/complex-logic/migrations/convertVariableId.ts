import { isChildId } from "../../../../tree/id";
import type { pluginMigrationFn } from "../../../../tree/type/migrations/createPluginMigration";
import { RecordVariable } from "../../../../variables/exports/types";
import type { IComplexLogicEdge } from "../exports/plugin";

/**
 * Initially we stored the childId differently in the complex logic edge.
 */
export const convertVariableId: pluginMigrationFn<IComplexLogicEdge> =
  () => async (edge) => {
    edge.conditions.forEach((condition) => {
      if (
        condition[0].variablePath &&
        !isChildId(condition[0].variablePath[1])
      ) {
        console.log(
          `Migrating ${edge.id} by converting the conditions variable path to a valid childId path.`,
        );

        condition[0].variablePath = condition[0].variablePath[1]
          ? RecordVariable.createChildIdPath(
              condition[0].variablePath[0] as any,
              condition[0].variablePath[1] as any,
            )
          : RecordVariable.createMainIdPath(
              condition[0].variablePath[0] as any,
            );
      }
    });
  };
