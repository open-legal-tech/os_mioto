import { z } from "zod";
import { ZInputPlugin } from "../ZInputPlugin";

export const EmailTypeName = "email" as const;

export const ZEmailInput = ZInputPlugin(EmailTypeName).extend({
  required: z.boolean(),
  placeholder: z.string().optional(),
});
