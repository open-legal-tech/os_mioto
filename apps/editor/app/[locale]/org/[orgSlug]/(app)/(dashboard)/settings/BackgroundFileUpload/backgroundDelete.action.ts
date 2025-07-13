"use server";

import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function backgroundDeleteAction() {
  const { db, user, revalidatePath } = await getCurrentEmployee();

  const organizationAGBUuid = await db.organization.findUnique({
    where: {
      uuid: user.organizationUuid,
    },
    select: {
      ClientPortal: {
        select: {
          backgroundUuid: true,
        },
      },
    },
  });

  if (!organizationAGBUuid?.ClientPortal?.backgroundUuid)
    return { success: false, failure: "logo_not_found" } as const;

  await db.asset.delete({
    where: {
      fileUuid: organizationAGBUuid.ClientPortal.backgroundUuid,
      organizationUuid: user.organizationUuid,
    },
  });

  revalidatePath("/settings");

  return { success: true } as const;
}
