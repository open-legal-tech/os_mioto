import type { TChildId, TNodeId } from "../../tree/id";
import { BaseVariable, type IBaseVariable } from "../Variable";
import type { IRecordVariable } from "../exports/types";

const typeName = "module";

export type TModuleVariableHistory = {
  id: TNodeId;
}[];

export type TModuleVariableValue<TErrorCodes extends string = string> = {
  history: { nodes: TModuleVariableHistory; position: number };
  variables: Record<TNodeId, IRecordVariable>;
  error?: TErrorCodes;
};

export interface IModuleVariable<
  Id extends TNodeId | TChildId = TNodeId | TChildId,
> extends IBaseVariable<typeof typeName, Id> {
  value: TModuleVariableValue[];
}

class CModuleVariable extends BaseVariable<IModuleVariable> {
  constructor() {
    super(typeName);
  }

  create = ({
    value = [],
    ...data
  }: Omit<IModuleVariable, "type" | "escapedName" | "value"> &
    Partial<Pick<IModuleVariable, "value">>) => {
    return {
      type: this.type,
      escapedName: this.createReadableKey([data.name]),
      value,
      ...data,
    } satisfies IModuleVariable;
  };
}

export const ModuleVariable = new CModuleVariable();
