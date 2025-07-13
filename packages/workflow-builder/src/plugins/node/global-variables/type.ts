import { z } from "zod";
import { ZChildId, ZMainChildId, ZNodeId } from "../../../tree/id";
import { ZNodePlugin } from "../../../tree/type/plugin/NodePlugin";
import type { TTreeClient } from "../../../tree/type/treeClient";
import { type TGlobalVariableId, globalVariableType } from "./plugin";

export const ZGlobalVariableId = z.custom<`globalVar_${string}`>(
  (val) => typeof val === "string" && val.startsWith("globalVar_"),
);

export const isGlobalVariableId = (value: any): value is TGlobalVariableId => {
  return ZGlobalVariableId.safeParse(value).success;
};

const ZGlobalVariableBase = z.object({
  references: z.array(z.union([ZMainChildId, ZNodeId, ZChildId])),
  id: ZGlobalVariableId,
});

export const ZGlobalTextVariable = ZGlobalVariableBase.extend({
  name: z.string(),
  type: z.literal("text"),
  defaultValue: z.string().optional(),
});

export const ZGlobalNumberVariable = ZGlobalVariableBase.extend({
  name: z.string(),
  type: z.literal("number"),
  defaultValue: z.number().optional(),
});

export const ZGlobalVariable = z.union([
  ZGlobalTextVariable,
  ZGlobalNumberVariable,
]);

export const ZGlobalVariablesNode = (treeClient: TTreeClient) =>
  ZNodePlugin(globalVariableType)(treeClient).extend({
    variables: z.record(ZGlobalVariable),
  });
