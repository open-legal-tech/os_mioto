import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { z } from "zod";
import type { DB } from "../../db/types";
import { download } from "./download";

export const getFileContent =
  (db: DB) =>
  async ({ fileUuid, orgUuid }: TInput) => {
    const file = await db.file.findUnique({ where: { uuid: fileUuid } });

    if (!file) return undefined;

    const content = await download({ ...file, orgUuid });

    return { ...file, content };
  };

export const getFileContentInput = z.object({
  fileUuid: z.string(),
  orgUuid: z.string(),
});

export type TInput = z.infer<typeof getFileContentInput>;

export type TFailures = ExtractFailures<typeof getFileContent>;

export type TData = ExcludeFailures<typeof getFileContent>;

export type TOutput = Awaited<ReturnType<typeof getFileContent>>;
