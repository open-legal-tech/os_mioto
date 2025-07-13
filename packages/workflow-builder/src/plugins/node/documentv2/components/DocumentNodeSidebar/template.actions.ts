"use server";
import { Failure } from "@mioto/errors";
import { createFile } from "@mioto/server/File/create";
import { createTemplate } from "@mioto/server/Template/create";
import { removeTemplate } from "@mioto/server/Template/remove";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function getTemplateDownloadLinkAction({
  treeInternalTemplateUuid,
  treeUuid,
}: {
  treeInternalTemplateUuid: string;
  treeUuid: string;
}) {
  const { db } = await getCurrentEmployee();

  const result = await db.tree.findUnique({
    where: {
      uuid: treeUuid,
    },
    select: {
      Template: {
        where: {
          treeInternalUuid: treeInternalTemplateUuid,
        },
      },
    },
  });

  const template = result?.Template[0];

  if (!template) {
    return {
      success: false,
      failure: new Failure({ code: "template_not_found" }).body(),
    } as const;
  }

  return {
    success: true,
    data: { downloadUrl: `/api/getFile/${template.fileUuid}` },
  } as const;
}

export async function createTemplateAction({
  fileUuid,
  treeUuid,
}: {
  treeUuid: string;
  fileUuid: string;
}) {
  const { db, user } = await getCurrentEmployee();

  const uploadedDocument = await createTemplate(db)({
    employee: user,
    treeUuid,
    fileUuid,
  });

  if (uploadedDocument instanceof Failure)
    return { success: false, failure: uploadedDocument.body() } as const;

  return {
    success: true,
    data: { treeInternalUuid: uploadedDocument.treeInternalUuid },
  } as const;
}

export async function updateTemplateAction({
  fileUuid,
  treeInternalTemplateUuid,
  treeUuid,
}: {
  fileUuid: string;
  treeInternalTemplateUuid: string;
  treeUuid: string;
}) {
  const { db, user } = await getCurrentEmployee();

  const uploadedDocument = await createTemplate(db)({
    employee: user,
    treeUuid,
    fileUuid,
  });

  if (uploadedDocument instanceof Failure)
    return { success: false, failure: uploadedDocument.body() } as const;

  await removeTemplate(db)({
    treeInternalTemplateUuid,
    treeUuid,
  });

  return {
    success: true,
    data: { treeInternalUuid: uploadedDocument.treeInternalUuid },
  } as const;
}

export async function deleteTemplateAction({
  treeInternalTemplateUuid,
  treeUuid,
}: {
  treeInternalTemplateUuid: string;
  treeUuid: string;
}) {
  const { db } = await getCurrentEmployee();

  const removedDocument = await removeTemplate(db)({
    treeInternalTemplateUuid,
    treeUuid,
  });

  if (removedDocument instanceof Failure)
    return { success: false, failure: removedDocument.body() };

  return { success: true };
}

export async function createFileUploadAction({
  displayName,
  ext,
  mime,
  fileData,
}: {
  displayName: string;
  ext: string;
  mime: string;
  fileData: ArrayBuffer;
}) {
  const { db, user } = await getCurrentEmployee();

  const file = await createFile(db)({
    displayName,
    extension: ext,
    fileType: mime,
    orgUuid: user.organizationUuid,
    fileData: Buffer.from(fileData),
  });

  return file;
}
