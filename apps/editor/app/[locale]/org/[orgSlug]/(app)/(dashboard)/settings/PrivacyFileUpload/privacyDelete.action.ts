"use server";

import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function privacyDeleteAction() {
  const { db, user, revalidatePath } = await getCurrentEmployee();

  const organizationAGBUuid = await db.organization.findUnique({
    where: {
      uuid: user.organizationUuid,
    },
    select: {
      ClientPortal: {
        select: {
          privacyUuid: true,
        },
      },
    },
  });

  if (!organizationAGBUuid?.ClientPortal?.privacyUuid)
    return { success: false, failure: "privacy_not_found" } as const;

  await db.asset.delete({
    where: {
      fileUuid: organizationAGBUuid.ClientPortal.privacyUuid,
      organizationUuid: user.organizationUuid,
    },
  });

  revalidatePath("/settings");

  return { success: true } as const;
}
