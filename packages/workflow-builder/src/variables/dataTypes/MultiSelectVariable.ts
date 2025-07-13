import type { TranslationFn, TranslationKeys } from "@mioto/locale";
import type { TChildId, TMainChildId } from "../../tree/id";
import { BaseVariable, type IBaseVariable } from "../Variable";

const typeName = "multi-select";

export interface IMultiSelectVariable<
  Id extends TMainChildId | TChildId = TMainChildId | TChildId,
> extends IBaseVariable<typeof typeName, Id> {
  values: { id: string; value?: string }[];
  value: string[];
  readableValue?: string[];
}

class CMultiSelectVariable extends BaseVariable<IMultiSelectVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TMainChildId | TChildId = TMainChildId | TChildId>({
    values = [],
    value = [],
    name,
    ...data
  }: Omit<
    IMultiSelectVariable<Id>,
    "type" | "escapedName" | "readableValue" | "value" | "status" | "name"
  > & {
    name:
      | {
          key: TranslationKeys;
          escapedName: string;
          t: TranslationFn;
        }
      | string;
  } & Partial<
      Pick<IMultiSelectVariable, "value">
    >): IMultiSelectVariable<Id> => {
    const translatedName =
      typeof name !== "string" ? name.t?.(name.key) ?? name.key : name;

    return {
      type: this.type,
      values,
      escapedName: this.createReadableKey([
        typeof name === "string" ? name : name.escapedName,
      ]),
      value,
      readableValue: value
        ?.map((valueId) => values.find((value) => value.id === valueId)?.value)
        .filter((value): value is string => value !== undefined),
      status: "ok",
      name: translatedName,
      ...data,
    };
  };
}

export { MultiSelectVariableIcon } from "./MultiSelectVariableIcon";

export const MultiSelectVariable = new CMultiSelectVariable();
