import { type TChildId, isChildId, isMainChildId } from "../../tree/id";
import type {
  IFileVariable,
  IRecordVariable,
  IRichTextVariable,
  PrimitiveVariable,
  Variable,
} from "../exports/types";

export function getRecordVariable<
  TChildVariables extends PrimitiveVariable | IFileVariable | IRichTextVariable,
>(
  variables: Record<string, IRecordVariable<TChildVariables>>,
  variableId: Variable["id"] | TChildId,
) {
  if (isChildId(variableId) || isMainChildId(variableId)) {
    const [parentId] = variableId.split("__");

    if (!parentId) {
      throw new Error(
        `Invalid variableId: ${variableId}. parentId could not be found. Variable ids should be in the format of parentId__variableId.`,
      );
    }

    const parent = variables?.[parentId];

    if (!parent) return undefined;

    return parent;
  }

  const variable = variables?.[variableId];

  if (!variable) return undefined;

  return variable;
}
