import {
  type ExcludeFailures,
  type ExtractFailures,
  Failure,
} from "@mioto/errors";
import { z } from "zod";
import { getFileType } from "../File/verifyFileType";

export const verifyTemplateFileType = async ({ file }: TInput) => {
  const fileType = await getFileType(file);

  if (fileType instanceof Failure) return fileType;

  const isNotWordDocument =
    fileType === undefined ||
    !(
      fileType.mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) ||
    !(fileType.ext === "docx");

  if (isNotWordDocument)
    return new Failure({
      code: "invalid_file_type",
    });

  return fileType;
};

export const verifyTemplateFileTypeInput = z.object({
  file: z.any(),
});

export type TInput = z.infer<typeof verifyTemplateFileTypeInput>;

export type TFailures = ExtractFailures<typeof verifyTemplateFileType>;

export type TData = ExcludeFailures<typeof verifyTemplateFileType>;

export type TOutput = Awaited<ReturnType<typeof verifyTemplateFileType>>;
