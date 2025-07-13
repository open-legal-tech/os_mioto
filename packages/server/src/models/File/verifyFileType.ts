import { Failure } from "@mioto/errors";
import { fileTypeFromBuffer } from "file-type";

export const getFileType = async (file: Uint8Array | ArrayBuffer) => {
  const result = await fileTypeFromBuffer(file);

  if (!result) {
    return new Failure({
      code: "unreadable_file_type",
    });
  }

  return result;
};
