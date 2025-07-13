import { z } from "zod";
import { ZInputPlugin } from "../ZInputPlugin";

export const MultiSelectInputTypeName = "multi-select" as const;

export const ZMultiSelectInput = ZInputPlugin(MultiSelectInputTypeName).extend({
  answers: z.array(
    z.object({ id: z.string().uuid(), value: z.string().optional() }),
  ),
  required: z.boolean(),
});
