import { z } from "zod";
import { ZInputPlugin } from "../ZInputPlugin";

export const SelectInputTypeName = "select" as const;

export const ZSelectInput = ZInputPlugin(SelectInputTypeName).extend({
  answers: z.array(
    z.object({ id: z.string().uuid(), value: z.string().optional() }),
  ),
  required: z.boolean(),
});
