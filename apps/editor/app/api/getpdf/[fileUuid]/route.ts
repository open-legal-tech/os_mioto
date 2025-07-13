import { checkAuthenticated } from "@mioto/server/db/checkAuthenticated";
import { getFileContent } from "@mioto/server/File/getContent";
import { PDFEngines } from "chromiumly";

export async function GET(
  _: Request,
  props: { params: Promise<{ fileUuid: string }> },
) {
  const params = await props.params;

  const { fileUuid } = params;

  const user = await checkAuthenticated();

  if (user === "unauthenticated") return new Response(null, { status: 401 });

  const file = await user.db.file.findUnique({
    where: { uuid: fileUuid },
  });

  if (!file) return new Response(null, { status: 404 });

  const fileContent = await getFileContent(user.db)({
    fileUuid,
    orgUuid: user.user.organizationUuid,
  });

  if (!fileContent) return new Response(null, { status: 404 });

  const buffer = await PDFEngines.convert({
    files: [Buffer.from(fileContent.content)],
  });

  return new Response(buffer);
}
