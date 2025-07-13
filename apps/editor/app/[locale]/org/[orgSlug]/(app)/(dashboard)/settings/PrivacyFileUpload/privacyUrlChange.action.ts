"use server";

import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function privacyUrlChangeAction({ newUrl }: { newUrl: string }) {
  const { db, user, revalidatePath } = await getCurrentEmployee();

  await db.clientPortal.update({
    where: {
      organizationUuid: user.organizationUuid,
    },
    data: {
      privacyUrl: newUrl,
    },
  });

  revalidatePath("/settings");

  return { success: true } as const;
}
