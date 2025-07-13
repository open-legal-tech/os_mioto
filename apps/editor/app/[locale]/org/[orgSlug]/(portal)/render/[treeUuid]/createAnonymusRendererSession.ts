import { dangerousFullAccessPrisma } from "@mioto/server/db/prisma";
import { emptySession } from "@mioto/workflow-builder/constants";

export async function createAnonymusRendererSession(
  organizationUuid: string,
  treeUuid: string,
) {
  const user = await dangerousFullAccessPrisma.user.create({
    data: {
      role: "ANONYMUS_USER",
      organizationUuid,
    },
  });
  const session = await dangerousFullAccessPrisma.session.create({
    data: {
      name: "Anonymus",
      state: emptySession,
      status: "IN_PROGRESS",
      treeUuid,
      ownerUuid: user.uuid,
    },
    include: { Tree: { select: { name: true } } },
  });

  return { session, user };
}
