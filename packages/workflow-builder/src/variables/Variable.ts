import type { TranslationKeys } from "@mioto/locale";
import { z } from "zod";
import type { TChildId, TMainChildId, TNodeId } from "../tree/id";
import { createReadableKey } from "./exports/createReadableKey";

export const ZVariablePlugin = z.object({
  id: z.string().uuid(),
  type: z.string(),
  name: z.string().optional(),
  value: z.any().optional(),
});

export type VariableExecutionStatus = "success" | "error" | "unexecuted";

export interface IBaseVariable<
  TType extends string = string,
  Id extends TNodeId | TChildId | TMainChildId =
    | TNodeId
    | TChildId
    | TMainChildId,
  TValue = any,
  TName extends string | { key: TranslationKeys; escapedName: string } = any,
> {
  id: Id;
  type: TType;
  name: TName;
  escapedName: string;
  status: "missing" | "ok";
  execution: VariableExecutionStatus;
  value?: TValue;
  main?: boolean;
}

export abstract class BaseVariable<
  TType extends IBaseVariable = IBaseVariable,
> {
  pluginType = "variable" as const;
  type: TType["type"];

  constructor(type: TType["type"]) {
    this.type = type;
  }

  getVariableId(variable: TType) {
    return variable.id;
  }

  abstract create: (data: any) => TType | undefined;

  createReadableKey = createReadableKey;
}
