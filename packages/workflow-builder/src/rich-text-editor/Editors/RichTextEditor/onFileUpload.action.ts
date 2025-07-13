"use server";

import { Failure } from "@mioto/errors";
import { createFile } from "@mioto/server/File/create";
import { getFileType } from "@mioto/server/File/verifyFileType";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function onFileUploadAction(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file)
    return {
      success: false,
      error: new Failure({
        code: "no_file_found",
        debugMessage:
          "Please provide the file as part of the passed formdata under the key 'file'.",
      }).body(),
    } as const;

  const auth = await getCurrentEmployee();

  if (auth instanceof Failure) {
    return {
      success: false,
      error: auth.body(),
    } as const;
  }

  const fileData = await file.arrayBuffer();
  const fileType = await getFileType(fileData);

  if (fileType instanceof Failure) {
    return {
      success: false,
      error: fileType.body(),
    } as const;
  }

  const result = await createFile(auth.db)({
    displayName: file.name,
    extension: fileType.ext,
    fileType: fileType.mime,
    orgUuid: auth.user.organizationUuid,
    fileData,
  });

  return {
    success: true,
    data: result,
  } as const;
}
