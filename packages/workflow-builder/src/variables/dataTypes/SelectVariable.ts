import type { TranslationKeys } from "@mioto/locale";
import type { TChildId, TMainChildId } from "../../tree/id";
import { BaseVariable, type IBaseVariable } from "../Variable";

const typeName = "select";

export interface ISelectVariable<
  Id extends TMainChildId | TChildId = TMainChildId | TChildId,
  Name extends string | { key: TranslationKeys; escapedName: string } = any,
> extends IBaseVariable<typeof typeName, Id, string, Name> {
  values: { id: string; value?: string }[];
  readableValue?: string;
}

class CSelectVariable extends BaseVariable<ISelectVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TMainChildId | TChildId = TMainChildId | TChildId>({
    values = [],
    value,
    name,
    ...data
  }: Omit<
    ISelectVariable<Id>,
    "type" | "escapedName" | "readableValue" | "status" | "name"
  > & {
    name: { key: TranslationKeys; escapedName: string } | string;
  }): ISelectVariable<Id> => {
    const selectedValue = values.find(
      (possibleValue) => possibleValue.id === value,
    );
    return {
      type: this.type,
      values,
      value,
      escapedName: this.createReadableKey([
        typeof name === "string" ? name : name.escapedName,
      ]),
      readableValue: selectedValue?.value ?? selectedValue?.id,
      status: "ok",
      name,
      ...data,
    };
  };
}

export { SelectVariableIcon } from "./SelectVariableIcon";

export const SelectVariable = new CSelectVariable();
