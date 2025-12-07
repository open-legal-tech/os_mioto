import { getUnknownUser } from "@mioto/server/db/getUnknownUser";
import { getFileContent } from "@mioto/server/File/getContent";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { convertContentToStream } from "../../../shared/convertFileContentToStream";

export const dynamic = "force-dynamic";

export async function GET(
  _: Request,
  props: {
    params: Promise<{ orgSlug: string }>;
  },
) {
  const params = await props.params;

  const { orgSlug } = params;

  const { db } = await getUnknownUser();

  const organization = await db.organization.findUnique({
    where: {
      slug: orgSlug,
    },
    select: {
      uuid: true,
      ClientPortal: {
        select: {
          Privacy: {
            select: {
              fileUuid: true,
            },
          },
          privacyUrl: true,
        },
      },
    },
  });

  if (organization?.ClientPortal?.privacyUrl)
    return NextResponse.redirect(organization.ClientPortal.privacyUrl, 308);

  if (!organization || !organization.ClientPortal?.Privacy?.fileUuid)
    return notFound();

  const fileContent = await getFileContent(db)({
    fileUuid: organization.ClientPortal.Privacy.fileUuid,
    orgUuid: organization.uuid,
  });

  if (!fileContent) return notFound();

  return convertContentToStream(fileContent);
}
