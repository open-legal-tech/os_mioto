import { z } from "zod";
import type { DB } from "../../db/types";
import { uploadFile } from "./upload";

export const updateFile =
  (db: DB) =>
  async ({
    uuid,
    displayName,
    extension,
    fileType,
    fileData,
    orgUuid,
  }: TInput) => {
    const file = await db.file.update({
      where: {
        uuid,
      },
      data: {
        displayName,
        extension,
        fileType,
      },
    });

    if (fileData) {
      await uploadFile({ fileData, orgUuid, ...file });
    }
  };

export const updateFileInput = z.object({
  fileType: z.string(),
  extension: z.string(),
  displayName: z.string(),
  uuid: z.string().optional(),
  fileData: z.any(),
  orgUuid: z.string(),
});

export type TInput = z.infer<typeof updateFileInput>;
