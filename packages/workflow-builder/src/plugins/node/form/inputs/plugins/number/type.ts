import { z } from "zod";
import { ZInputPlugin } from "../ZInputPlugin";

export const NumberInputTypeName = "number" as const;

export const ZNumberInput = ZInputPlugin(NumberInputTypeName).extend({
  required: z.boolean(),
  min: z.number().optional(),
  max: z.number().optional(),
  roundTo: z.number().optional(),
  placeholder: z.string().optional(),
});
