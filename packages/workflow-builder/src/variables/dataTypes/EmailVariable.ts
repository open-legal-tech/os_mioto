import type { TChildId, TMainChildId } from "../../tree/id";
import { BaseVariable, type IBaseVariable } from "../Variable";

const typeName = "email";

export interface IEmailVariable<
  Id extends TChildId | TMainChildId = TChildId | TMainChildId,
> extends IBaseVariable<typeof typeName, Id> {
  value?: string;
  readableValue?: string;
}

class CEmailVariable extends BaseVariable<IEmailVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TChildId | TMainChildId = TChildId | TMainChildId>({
    value,
    name,
    ...data
  }: Omit<
    IEmailVariable<Id>,
    "type" | "escapedName" | "readableValue" | "status" | "name"
  > & {
    name: string;
  }): IEmailVariable<Id> => {
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

export { EnvelopeSimple as EmailVariableIcon } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";

export const EmailVariable = new CEmailVariable();
