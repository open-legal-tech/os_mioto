import { getUnknownUser } from "@mioto/server/db/getUnknownUser";

export async function getPortalAssets({ orgSlug }: { orgSlug: string }) {
  const { db } = await getUnknownUser();
  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
    select: {
      uuid: true,
      homepageUrl: true,
      ClientPortal: {
        select: {
          backgroundUrl: true,
          logoUrl: true,
          logoUuid: true,
          backgroundUuid: true,
        },
      },
    },
  });

  if (!org?.ClientPortal) return undefined;

  const [backgroundUrl, logoUrl] = await Promise.all([
    org.ClientPortal.backgroundUrl
      ? org.ClientPortal.backgroundUrl
      : org?.ClientPortal?.backgroundUuid
        ? `/api/getFile/${org.ClientPortal.backgroundUuid}`
        : null,
    org.ClientPortal.logoUrl
      ? org.ClientPortal.logoUrl
      : org?.ClientPortal?.logoUuid
        ? `/api/getFile/${org.ClientPortal.logoUuid}`
        : null,
  ]);

  return { backgroundUrl, logoUrl };
}
