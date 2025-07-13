import { z } from "zod";
import { ZInputPlugin } from "../ZInputPlugin";

export const FileInputTypeName = "file" as const;

export type IFileInput = z.infer<typeof ZFileInput>;

export const ZFileInput = ZInputPlugin(FileInputTypeName).extend({
  required: z.boolean(),
  accept: z.array(z.enum(["pdf", "docx"])).optional(),
});
