import prisma from "@mioto/prisma";
import type { Roles } from "@mioto/prisma";
import { enhance } from "@zenstackhq/runtime";

export async function getUnknownUser(user?: {
  orgSlug: string;
  uuid: string;
  role: Roles;
}) {
  const org = user?.orgSlug
    ? await prisma.organization.findUnique({ where: { slug: user.orgSlug } })
    : undefined;

  return {
    db: enhance(
      prisma,
      {
        user:
          user && org
            ? {
                organizationUuid: org.uuid,
                uuid: user.uuid,
                role: user.role,
              }
            : undefined,
      },
      { logPrismaQuery: true },
    ),
  };
}
