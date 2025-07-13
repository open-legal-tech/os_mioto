import { z } from "zod";
import { ZInputPlugin } from "../ZInputPlugin";

export const FormattedTextAreaTypeName = "rich-text" as const;

export const ZFormattedTextAreaInput = ZInputPlugin(
  FormattedTextAreaTypeName,
).extend({
  required: z.boolean(),
  placeholder: z.string().optional(),
});
