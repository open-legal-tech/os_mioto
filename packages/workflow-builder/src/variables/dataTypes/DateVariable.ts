import type { TranslationFn, TranslationKeys } from "@mioto/locale";
import { getUnixTime } from "date-fns";
import type { TChildId, TMainChildId } from "../../tree/id";
import { BaseVariable, type IBaseVariable } from "../Variable";
import { RecordVariable } from "./RecordVariable";

const typeName = "date";

export interface IDateVariable<
  Id extends TMainChildId | TChildId = TMainChildId | TChildId,
> extends IBaseVariable<typeof typeName, Id> {
  value?: number;
  readableValue?: string;
}

class CDateVariable extends BaseVariable<IDateVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TMainChildId | TChildId = TMainChildId | TChildId>({
    name,
    value,
    ...data
  }: Omit<
    IDateVariable<Id>,
    "type" | "escapedName" | "status" | "name" | "value"
  > & {
    value?: Date;
    name:
      | {
          key: TranslationKeys;
          escapedName: string;
          t: TranslationFn;
        }
      | string;
  }): IDateVariable<Id> => {
    const translatedName =
      typeof name !== "string" ? name.t?.(name.key) ?? name.key : name;

    return {
      type: this.type,
      escapedName: this.createReadableKey([
        typeof name === "string" ? name : name.escapedName,
      ]),
      status: "ok",
      main: RecordVariable.isMainIdPath(data.id),
      name: translatedName,
      ...(value ? { value: getUnixTime(value) } : {}),
      ...data,
    };
  };
}

export const DateVariable = new CDateVariable();
export { Calendar as DateIcon } from "@phosphor-icons/react/dist/ssr/Calendar";
