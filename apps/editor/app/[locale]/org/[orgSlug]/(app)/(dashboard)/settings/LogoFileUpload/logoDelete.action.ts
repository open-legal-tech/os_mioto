"use server";

import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function logoDeleteAction() {
  const { db, user, revalidatePath } = await getCurrentEmployee();

  const organizationAGBUuid = await db.organization.findUnique({
    where: {
      uuid: user.organizationUuid,
    },
    select: {
      ClientPortal: {
        select: {
          logoUuid: true,
        },
      },
    },
  });

  if (!organizationAGBUuid?.ClientPortal?.logoUuid)
    return { success: false, failure: "logo_not_found" } as const;

  await db.asset.delete({
    where: {
      fileUuid: organizationAGBUuid.ClientPortal.logoUuid,
      organizationUuid: user.organizationUuid,
    },
  });

  revalidatePath("/settings");

  return { success: true } as const;
}
