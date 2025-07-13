import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";
import { z } from "zod";
import serverModelsEnv from "../../../env";

const blobServiceClient = new BlobServiceClient(
  `https://${serverModelsEnv.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
  new DefaultAzureCredential(),
);

const containerClient = blobServiceClient.getContainerClient(
  serverModelsEnv.AZURE_STORAGE_CONTAINER,
);

export const getBlobClient = ({
  orgUuid,
  uuid,
  extension,
}: TGetBlobClientParams) => {
  const blobClient = containerClient.getBlockBlobClient(
    `${orgUuid}/${uuid}.${extension}`,
  );

  if (!blobClient.exists()) {
    return containerClient.getBlockBlobClient(`${orgUuid}`);
  }

  return blobClient;
};

export type TGetBlobClientParams = z.infer<typeof ZFileIdentifier>;

export const ZFileIdentifier = z.object({
  orgUuid: z.string(),
  uuid: z.string(),
  extension: z.string(),
});
