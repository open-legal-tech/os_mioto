import type { Variable } from "../../variables/exports/types";

export const createVariableNameString = (
  recordVariable: Variable,
  childVariable: Variable,
) => {
  return childVariable.main
    ? `${recordVariable.name}`
    : `${recordVariable.name}: ${childVariable.name}`;
};
