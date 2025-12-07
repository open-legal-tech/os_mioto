import type { AnonymusAuth, Auth } from "@mioto/server/db/checkAuthenticated";
import { getFileContent } from "@mioto/server/File/getContent";
import { convertContentToStream } from "../../shared/convertFileContentToStream";

export async function getFile({
  user,
  fileUuid,
}: {
  user: Auth | AnonymusAuth;
  fileUuid: string;
}) {
  const file = await user.db.file.findUnique({
    where: { uuid: fileUuid },
  });

  if (!file) return new Response(null, { status: 404 });

  const fileContent = await getFileContent(user.db)({
    fileUuid,
    orgUuid: user.user.organizationUuid,
  });

  if (!fileContent) return new Response(null, { status: 404 });

  return convertContentToStream(fileContent);
}
