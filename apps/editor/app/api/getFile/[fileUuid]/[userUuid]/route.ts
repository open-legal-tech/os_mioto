import {
  checkAuthenticated,
  checkAuthWithAnonymus,
} from "@mioto/server/db/checkAuthenticated";
import { getFileContent } from "@mioto/server/File/getContent";
import { getFile } from "../../getFile";

export async function GET(
  _: Request,
  props: { params: Promise<{ fileUuid: string; userUuid: string }> },
) {
  const params = await props.params;

  const { fileUuid } = params;

  const user = await checkAuthWithAnonymus(params.userUuid);

  return getFile({ user, fileUuid });
}
