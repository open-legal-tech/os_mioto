import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { z } from "zod";
import type { DB } from "../../db/types";
import { getBlobClient } from "./shared";
import type { Readable } from "stream";

export const getFileContentAsBuffer =
  (db: DB) =>
  async ({ fileUuid, orgUuid }: TInput) => {
    const file = await db.file.findUnique({ where: { uuid: fileUuid } });

    if (!file) return undefined;

    const blobClient = getBlobClient({ ...file, orgUuid });
    const fileDownload = await blobClient.download();

    const chunks: Buffer[] = [];
    const readable = fileDownload.readableStreamBody as Readable;

    for await (const chunk of readable) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const content = Buffer.concat(chunks);

    return { ...file, content };
  };

export const getFileContentAsBufferInput = z.object({
  fileUuid: z.string(),
  orgUuid: z.string(),
});

export type TInput = z.infer<typeof getFileContentAsBufferInput>;

export type TFailures = ExtractFailures<typeof getFileContentAsBuffer>;

export type TData = ExcludeFailures<typeof getFileContentAsBuffer>;

export type TOutput = Awaited<ReturnType<typeof getFileContentAsBuffer>>;
