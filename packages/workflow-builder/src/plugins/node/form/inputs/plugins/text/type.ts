import { z } from "zod";
import { ZInputPlugin } from "../ZInputPlugin";

export const TextTypeName = "text" as const;

export const ZTextInput = ZInputPlugin(TextTypeName).extend({
  required: z.boolean(),
  placeholder: z.string().optional(),
});
