import type { TChildId, TMainChildId } from "../../tree/id";
import { BaseVariable, type IBaseVariable } from "../Variable";

const typeName = "text";

export interface ITextVariable<
  Id extends TChildId | TMainChildId = TChildId | TMainChildId,
> extends IBaseVariable<typeof typeName, Id> {
  value?: string;
  readableValue?: string;
}

class CTextVariable extends BaseVariable<ITextVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TChildId | TMainChildId = TChildId | TMainChildId>({
    value,
    name,
    ...data
  }: Omit<
    ITextVariable<Id>,
    "type" | "escapedName" | "readableValue" | "status" | "name"
  > & {
    name: string;
  }): ITextVariable<Id> => {
    return {
      type: this.type,
      escapedName: this.createReadableKey([name]),
      value,
      readableValue: value,
      status: "ok",
      name,
      ...data,
    };
  };
}

export { Paragraph as TextVariableIcon } from "@phosphor-icons/react/dist/ssr/Paragraph";

export const TextVariable = new CTextVariable();
