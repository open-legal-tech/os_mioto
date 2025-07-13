import { z } from "zod";
import { ZInputPlugin } from "../ZInputPlugin";

export const DateTypeName = "date" as const;

export const ZDateInput = ZInputPlugin(DateTypeName).extend({
  required: z.boolean(),
});
