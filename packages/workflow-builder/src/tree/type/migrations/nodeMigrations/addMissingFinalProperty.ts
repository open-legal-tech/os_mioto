import type { entityMigrationFunction } from "../createMigrationFn";

function isEmpty(value: any) {
  return (
    value == null || (typeof value === "string" && value.trim().length === 0)
  );
}

export const addMissingFinalProperty: entityMigrationFunction =
  (_) => async (node) => {
    if (isEmpty(node.final)) {
      console.log(`Add missing final property to node ${node.id}`);
      node.final = false;
    }
  };
