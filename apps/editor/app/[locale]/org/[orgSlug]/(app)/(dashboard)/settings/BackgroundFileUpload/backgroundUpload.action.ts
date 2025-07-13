"use server";

import { Failure } from "@mioto/errors";
import { createFile } from "@mioto/server/File/create";
import { uploadFile } from "@mioto/server/File/upload";
import { getFileType } from "@mioto/server/File/verifyFileType";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function backgroundUploadAction(formdata: FormData) {
  const file = formdata.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  const { db, user, revalidatePath } = await getCurrentEmployee();

  const fileData = await file.arrayBuffer();
  const fileType = await getFileType(fileData);

  if (fileType instanceof Failure) {
    return { success: false, failure: fileType.body() } as const;
  }

  const result = await createFile(db)({
    displayName: file.name,
    extension: fileType.ext,
    fileType: fileType.mime,
    fileData: await file.arrayBuffer(),
    orgUuid: user.organizationUuid,
  });

  await db.asset.create({
    data: {
      fileUuid: result.uuid,
      organizationUuid: user.organizationUuid,
      ClientPortalBackground: {
        connect: {
          organizationUuid: user.organizationUuid,
        },
      },
    },
  });

  revalidatePath("/settings");

  return { success: true } as const;
}
