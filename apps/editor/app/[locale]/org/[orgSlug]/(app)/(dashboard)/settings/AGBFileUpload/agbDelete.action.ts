"use server";

import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function agbDeleteAction() {
  const { db, user, revalidatePath } = await getCurrentEmployee();

  const agb = await db.clientPortal.findUnique({
    where: {
      organizationUuid: user.organizationUuid,
    },
    select: {
      termsUuid: true,
      termsUrl: true,
    },
  });

  if (!agb?.termsUuid && !agb?.termsUrl)
    return { success: false, failure: "agb_not_found" } as const;

  if (agb.termsUrl) {
    await db.clientPortal.update({
      where: {
        organizationUuid: user.organizationUuid,
      },
      data: {
        termsUrl: null,
      },
    });
  }

  if (agb.termsUuid) {
    await db.asset.delete({
      where: {
        fileUuid: agb.termsUuid,
        organizationUuid: user.organizationUuid,
      },
    });
  }

  revalidatePath("/settings");

  return { success: true } as const;
}
