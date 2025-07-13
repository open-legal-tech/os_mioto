import { Failure, FatalError } from "@mioto/errors";
import { getBlobClient } from "./shared";
import type { DB } from "../../db/types";

export const copyFile =
  (db: DB) =>
  async ({ sourceUuid, orgUuid }: { sourceUuid: string; orgUuid: string }) => {
    const sourceFile = await db.file.findUnique({
      where: { uuid: sourceUuid },
    });

    if (!sourceFile) {
      return new Failure({
        code: "NOT_FOUND",
        debugMessage: "Source file not found",
      });
    }

    const destinationFile = await db.file.create({
      data: {
        ...sourceFile,
        uuid: undefined,
      },
    });

    try {
      const sourceBlobClient = getBlobClient({ ...sourceFile, orgUuid });
      const destinationBlobClient = getBlobClient({
        ...destinationFile,
        orgUuid,
      });

      const copyPoller = await destinationBlobClient.beginCopyFromURL(
        sourceBlobClient.url,
      );
      await copyPoller.pollUntilDone();

      return { success: true, destinationFile, sourceFile };
    } catch (e) {
      throw new FatalError({
        code: "document_copy_failed",
        parentError: e,
        debugMessage:
          "Failed to copy document. We expect this to always succeed. This might fail if the object storage is down.",
      });
    }
  };
