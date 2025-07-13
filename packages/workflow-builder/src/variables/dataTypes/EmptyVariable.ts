import type { TranslationFn, TranslationKeys } from "@mioto/locale";
import type { TChildId, TMainChildId } from "../../tree/id";
import { BaseVariable, type IBaseVariable } from "../Variable";

const typeName = "empty";

export interface IEmptyVariable<
  Id extends TMainChildId | TChildId = TMainChildId | TChildId,
> extends IBaseVariable<typeof typeName, Id> {
  value: undefined;
  readableValue: undefined;
}

class CEmptyVariable extends BaseVariable<IEmptyVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TMainChildId | TChildId = TMainChildId | TChildId>({
    name,
    ...data
  }: Omit<
    IEmptyVariable<Id>,
    "type" | "escapedName" | "value" | "readableValue" | "status" | "name"
  > & {
    name:
      | {
          key: TranslationKeys;
          escapedName: string;
          t: TranslationFn;
        }
      | string;
  }): IEmptyVariable<Id> => {
    const translatedName =
      typeof name !== "string" ? name.t?.(name.key) ?? name.key : name;

    return {
      type: this.type,
      escapedName: this.createReadableKey([
        typeof name === "string" ? name : name.escapedName,
      ]),
      value: undefined,
      readableValue: undefined,
      status: "ok",
      name: translatedName,
      ...data,
    };
  };
}

export const EmptyVariable = new CEmptyVariable();
