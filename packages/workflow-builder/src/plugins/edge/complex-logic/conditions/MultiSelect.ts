import { z } from "zod";
import { selectOperatorKeys, selectOperators } from "./Select";
import { ZCondition } from "./types";

export const multiSelectOperators = selectOperators;

export const ZMultiSelectCondition = ZCondition("multi-select").extend({
  operator: z.enum(selectOperatorKeys).optional(),
  comparator: z.array(z.string()),
});

export type MultiSelectCondition = z.infer<typeof ZMultiSelectCondition>;
