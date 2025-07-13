import { Failure } from "@mioto/errors";

import { createFileUploadAction } from "./template.actions";

const uploadFailure = new Failure({ code: "upload_failed" });
const fileSizeError = new Failure({ code: "size_too_large" });

export async function uploadFile(file: File, maxSize: number) {
  if (file.size > maxSize) {
    return fileSizeError;
  }
  const fileData = await file.arrayBuffer();

  const fileUpload = await createFileUploadAction({
    displayName: file.name,
    ext: "docx",
    mime: file.type,
    fileData,
  });

  if (fileUpload instanceof Failure) {
    return uploadFailure;
  }

  return fileUpload;
}
