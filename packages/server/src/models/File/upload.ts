import { z } from "zod";
import { getBlobClient, ZFileIdentifier } from "./shared";

export const uploadFile = async ({ fileData, fileType, ...identifier }: TInput) => {
  const blobClient = getBlobClient(identifier);

  return await blobClient.uploadData(fileData);
};

const createFileInput = ZFileIdentifier.extend({
  fileData: z.any(),
  fileType: z.string(),
});

export type TInput = z.infer<typeof createFileInput>;
