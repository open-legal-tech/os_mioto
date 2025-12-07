import { getBlobClient, type TGetBlobClientParams } from "./shared";

export const download = async (params: TGetBlobClientParams) => {
  const blobClient = getBlobClient(params);
  return await blobClient.download();
};
