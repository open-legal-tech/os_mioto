"use server";

import { getFileContent } from "@mioto/server/File/getContent";
import { getFileContentAsBuffer } from "@mioto/server/File/getContentAsBuffer";
import { checkAuthWithAnonymus } from "@mioto/server/db/checkAuthenticated";

export async function getFileAction({
  fileUuid,
  userUuid,
}: {
  fileUuid: string;
  userUuid: string;
}) {
  const { db, user } = await checkAuthWithAnonymus(userUuid);

  const file = await getFileContentAsBuffer(db)({
    fileUuid,
    orgUuid: user.organizationUuid,
  });

  if (!file?.content) return;

  return {
    data: file.content,
    name: file.displayName,
    downloadLink: `/api/getFile/${file.uuid}`,
  };
}
