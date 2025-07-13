import type { TranslationFn, TranslationKeys } from "@mioto/locale";
import type { TChildId, TMainChildId } from "../../tree/id";
import { BaseVariable, type IBaseVariable } from "../Variable";
import { RecordVariable } from "./RecordVariable";

const typeName = "boolean";

export interface IBooleanVariable<
  Id extends TMainChildId | TChildId = TMainChildId | TChildId,
> extends IBaseVariable<typeof typeName, Id> {
  value: boolean;
  values: { true: string; false: string };
  readableValue: string;
}

class CBooleanVariable extends BaseVariable<IBooleanVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TMainChildId | TChildId = TMainChildId | TChildId>({
    name,
    ...data
  }: Omit<
    IBooleanVariable<Id>,
    "type" | "escapedName" | "status" | "main" | "name"
  > & {
    name:
      | {
          key: TranslationKeys;
          escapedName: string;
          t: TranslationFn;
        }
      | string;
  }): IBooleanVariable<Id> => {
    const translatedName =
      typeof name !== "string" ? name.t?.(name.key) ?? name.key : name;

    return {
      type: this.type,
      escapedName: this.createReadableKey([
        typeof name === "string" ? name : name.escapedName,
      ]),
      name: translatedName,
      status: "ok",
      main: RecordVariable.isMainIdPath(data.id),
      ...data,
    };
  };
}

export const BooleanVariable = new CBooleanVariable();
export { CircleHalf as BooleanIcon } from "@phosphor-icons/react/dist/ssr/CircleHalf";
