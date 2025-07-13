import { z } from "zod";
import {
  ZEdgePlugin,
  type ZEdgePluginParams,
} from "../../../../tree/type/plugin/EdgePlugin";
import { ZBooleanCondition } from "../conditions/Boolean";
import { ZDateCondition } from "../conditions/Date";
import { ZMultiSelectCondition } from "../conditions/MultiSelect";
import { ZNumberCondition } from "../conditions/Number";
import { ZPlaceholderCondition } from "../conditions/Placeholder";
import { ZSelectCondition } from "../conditions/Select";
import { ZTextCondition } from "../conditions/Text";
import { ComplexLogicEdge } from "./plugin";

export const ZCondition = z.discriminatedUnion("type", [
  ZSelectCondition,
  ZNumberCondition,
  ZPlaceholderCondition,
  ZBooleanCondition,
  ZMultiSelectCondition,
  ZTextCondition,
  ZDateCondition,
]);

export type TCondition = z.infer<typeof ZCondition>;

export const ZComplexLogicEdge = (treeClient: ZEdgePluginParams) =>
  ZEdgePlugin(ComplexLogicEdge.type)(treeClient, {
    conditions: z.array(z.tuple([ZCondition, z.enum(["and", "or", "none"])])),
  });
