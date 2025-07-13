import type { pluginMigrationFn } from "../../../../tree/type/migrations/createPluginMigration";
import type { ICalculationNode } from "../plugin";

export const addCalculationType: pluginMigrationFn<ICalculationNode> =
  (_) => async (node) => {
    console.log(
      `Migrating ${node.id} by adding the calculationType property with the value number.`,
    );

    node.calculationType = "number";
  };
