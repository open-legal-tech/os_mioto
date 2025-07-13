import { z } from "zod";
import type { DB } from "../../db/types";
import { uploadFile } from "./upload";

export const createFile =
  (db: DB) =>
  async ({ fileType, extension, displayName, fileData, orgUuid }: TInput) => {
    const file = await db.file.create({
      data: {
        displayName,
        extension,
        fileType,
      },
    });

    if (fileData) {
      await uploadFile({ fileData, orgUuid, ...file });
    }

    return { ...file, url: `/api/getFile/${file.uuid}` };
  };

export const createFileInput = z.object({
  fileType: z.string(),
  extension: z.string(),
  displayName: z.string(),
  uuid: z.string().optional(),
  fileData: z.any(),
  orgUuid: z.string(),
});

export type TInput = z.infer<typeof createFileInput>;
