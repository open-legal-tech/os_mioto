import { getUnknownUser } from "@mioto/server/db/getUnknownUser";
import { getFileContent } from "@mioto/server/File/getContent";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

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
    where: { slug: orgSlug },
    select: {
      uuid: true,
      ClientPortal: {
        select: {
          termsUrl: true,
          Terms: {
            select: {
              fileUuid: true,
            },
          },
        },
      },
    },
  });

  if (organization?.ClientPortal?.termsUrl)
    return NextResponse.redirect(organization.ClientPortal.termsUrl, 308);

  if (!organization || !organization.ClientPortal?.Terms?.fileUuid)
    return notFound();

  const fileContent = await getFileContent(db)({
    fileUuid: organization.ClientPortal.Terms.fileUuid,
    orgUuid: organization.uuid,
  });

  if (!fileContent) return notFound();

  return new Response(fileContent.content);
}
