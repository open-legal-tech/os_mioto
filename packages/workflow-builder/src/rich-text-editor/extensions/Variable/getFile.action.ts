"use server";

import { checkAuthWithAnonymus } from "@mioto/server/db/checkAuthenticated";
import { getFileContent } from "@mioto/server/File/getContent";

export async function getFileAction({
  fileUuid,
  userUuid,
}: {
  fileUuid: string;
  userUuid: string;
}) {
  const { db, user } = await checkAuthWithAnonymus(userUuid);

  const file = await getFileContent(db)({
    fileUuid,
    orgUuid: user.organizationUuid,
  });

  if (!file?.content) return;

  return new Uint8Array(file.content);
}
