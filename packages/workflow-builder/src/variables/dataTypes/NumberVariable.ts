import type { TranslationFn, TranslationKeys } from "@mioto/locale";
import type { TChildId, TMainChildId } from "../../tree/id";
import { BaseVariable, type IBaseVariable } from "../Variable";

const typeName = "number";

export interface INumberVariable<
  Id extends TMainChildId | TChildId = TMainChildId | TChildId,
> extends IBaseVariable<typeof typeName, Id> {
  value?: string;
  readableValue?: string;
}

class CNumberVariable extends BaseVariable<INumberVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TMainChildId | TChildId = TMainChildId | TChildId>({
    value,
    name,
    ...data
  }: Omit<INumberVariable<Id>, "type" | "escapedName" | "status" | "name"> & {
    name:
      | {
          key: TranslationKeys;
          escapedName: string;
          t: TranslationFn;
        }
      | string;
  }): INumberVariable<Id> => {
    const translatedName =
      typeof name !== "string" ? name.t?.(name.key) ?? name.key : name;

    return {
      type: this.type,
      escapedName: this.createReadableKey([
        typeof name === "string" ? name : name.escapedName,
      ]),
      value,
      readableValue: value,
      status: "ok",
      name: translatedName,
      ...data,
    };
  };
}

export { NumberVariableIcon } from "./NumberVariableIcon";

export const NumberVariable = new CNumberVariable();
