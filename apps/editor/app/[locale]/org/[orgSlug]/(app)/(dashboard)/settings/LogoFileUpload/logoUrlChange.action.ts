"use server";

import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function logoUrlChangeAction({ newUrl }: { newUrl: string }) {
  const { db, user, revalidatePath } = await getCurrentEmployee();

  await db.clientPortal.update({
    where: {
      organizationUuid: user.organizationUuid,
    },
    data: {
      logoUrl: newUrl,
    },
  });

  revalidatePath("/settings");

  return { success: true } as const;
}
