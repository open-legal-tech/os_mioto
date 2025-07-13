import { z } from "zod";
import { ZInputPlugin } from "../ZInputPlugin";

export const TextAreaTypeName = "textarea" as const;

export const ZTextAreaInput = ZInputPlugin(TextAreaTypeName).extend({
  required: z.boolean(),
  placeholder: z.string().optional(),
});
