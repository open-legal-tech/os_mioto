import { z } from "zod";
import { getBlobClient, ZFileIdentifier } from "./shared";
import type { DB } from "../../db/types";
import { Failure } from "@mioto/errors";

export const removeFile =
  (db: DB) => async (params: { uuid: string; orgUuid: string }) => {
    const file = await db.file.findUnique({
      where: {
        uuid: params.uuid,
      },
    });

    if (!file)
      return new Failure({
        code: "file_not_found",
      });

    const blobClient = getBlobClient({ ...file, orgUuid: params.orgUuid });

    await db.file.delete({ where: { uuid: file.uuid } });

    return await blobClient.deleteIfExists();
  };

const removeFileInput = ZFileIdentifier;

export type TInput = z.infer<typeof removeFileInput>;
