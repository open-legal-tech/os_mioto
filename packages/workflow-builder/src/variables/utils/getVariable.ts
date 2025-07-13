import { type TChildId, isChildId } from "../../tree/id";
import {
  type IFileVariable,
  type IRecordVariable,
  type IRichTextVariable,
  type PrimitiveVariable,
  RecordVariable,
  type Variable,
} from "../exports/types";

export function getVariable<
  TVariables extends PrimitiveVariable | IFileVariable | IRichTextVariable,
>(
  variables: Record<string, IRecordVariable<TVariables>>,
  variableId: Variable["id"] | TChildId,
) {
  if (isChildId(variableId)) {
    const [parentId] = variableId.split("__");

    if (!parentId) {
      throw new Error(
        `Invalid variableId: ${variableId}. parentId could not be found. Variable ids should be in the format of parentId__variableId.`,
      );
    }

    const parent = variables?.[parentId] as IRecordVariable<TVariables>;

    if (!parent) return undefined;

    return parent.value?.[variableId] as TVariables;
  }

  const variable = variables?.[variableId] as IRecordVariable<TVariables>;

  if (!variable) return undefined;

  return RecordVariable.getMainValue(variable) as TVariables;
}
