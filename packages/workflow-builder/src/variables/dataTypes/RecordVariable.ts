import { Failure } from "@mioto/errors";
import { mapToObj } from "remeda";
import type { ValuesType } from "utility-types";
import {
  type TChildId,
  type TId,
  type TMainChildId,
  type TNodeId,
  ZChildId,
  isNodeId,
} from "../../tree/id";
import { BaseVariable, type IBaseVariable } from "../Variable";
import type {
  IFileVariable,
  IRichTextVariable,
  PrimitiveVariable,
} from "../exports/types";

const childNotFound = new Failure({
  code: "child_not_found",
});

const typeName = "record";

export interface IRecordVariable<
  TValues extends PrimitiveVariable | IFileVariable | IRichTextVariable =
    | PrimitiveVariable
    | IFileVariable
    | IRichTextVariable,
  TId extends TNodeId = TNodeId,
> extends IBaseVariable<typeof typeName, TId> {
  value: Record<TChildId | TMainChildId, TValues>;
  system?: boolean;
}

export type createRecordVariableData<
  TValues extends PrimitiveVariable | IFileVariable | IRichTextVariable,
> = Omit<IRecordVariable, "type" | "escapedName" | "value" | "name"> & {
  value:
    | ValuesType<IRecordVariable<TValues>["value"]>[]
    | IRecordVariable<TValues>["value"];

  name: string;
};

class CRecordVariable extends BaseVariable<IRecordVariable> {
  constructor() {
    super(typeName);
  }

  create = <
    TValues extends PrimitiveVariable | IFileVariable | IRichTextVariable,
  >({
    value = [],
    name,
    ...data
  }: createRecordVariableData<TValues>) => {
    return {
      type: this.type,
      escapedName: this.createReadableKey([name]),
      name,
      value: Array.isArray(value)
        ? mapToObj(value, (element) => [element.id, element])
        : value,
      ...data,
    } satisfies IRecordVariable;
  };

  is(variable: any): variable is IRecordVariable {
    return variable.type === typeName && isNodeId(variable.id);
  }

  createChildIdPath(parentId: TNodeId, childId: TId): TChildId {
    return `${parentId}__${childId}`;
  }

  createMainIdPath(id: TNodeId): TMainChildId {
    return `${id}__${id}`;
  }

  isMainIdPath(path: string): path is TMainChildId {
    const [id1, id2] = path.split("__");

    return id1 === id2;
  }

  isRecordId = isNodeId;

  isChildId(path: string): path is TChildId {
    const [id1, id2] = path.split("__");
    return id1 !== id2 && ZChildId.safeParse(path).success;
  }

  splitVariableId(path: TNodeId | TChildId | TMainChildId) {
    const [recordId, childId] = path.split("__");

    return {
      recordId: recordId as TNodeId,
      childId: childId as TId,
      id: childId ? (path as TChildId | TMainChildId) : undefined,
    };
  }

  createMainVariablePath(parentId: TNodeId): TMainChildId {
    return this.createMainIdPath(parentId);
  }

  createVariablePath(parentId: TNodeId, childId: TId): TChildId {
    return this.createChildIdPath(parentId, childId);
  }

  createVariablePathByName<TId extends TNodeId = TNodeId>(
    variable: IRecordVariable<any, TId>,
    name: string,
  ): [TId, TChildId] | typeof childNotFound {
    const childValue = this.getValueByName(variable, name);

    if (!childValue) return childNotFound;

    return [variable.id, childValue.id];
  }

  getValue<
    TVariable extends PrimitiveVariable | IFileVariable | IRichTextVariable,
  >(
    variable: IRecordVariable<TVariable>,
    id: TChildId | TMainChildId | TNodeId,
  ) {
    return this.isChildId(id) || this.isMainIdPath(id)
      ? variable.value[id]
      : variable;
  }

  getChildValue<
    TVariable extends PrimitiveVariable | IFileVariable | IRichTextVariable,
  >(variable: IRecordVariable<TVariable>, id: TChildId | TMainChildId) {
    return variable.value[id];
  }

  getValueByName(variable: IRecordVariable, name: string) {
    return Object.values(variable.value ?? {}).find(
      (variable) => variable.name === name,
    );
  }

  getMainValue<
    TValues extends PrimitiveVariable | IFileVariable | IRichTextVariable,
  >(variable: IRecordVariable<TValues>) {
    return variable.value[this.createChildIdPath(variable.id, variable.id)]
      ? variable.value[this.createChildIdPath(variable.id, variable.id)]
      : undefined;
  }
}

export const RecordVariable = new CRecordVariable();
