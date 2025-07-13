"use server";

import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function removeThemeAction({ themeUuid }: { themeUuid: string }) {
  const { db, revalidatePath } = await getCurrentEmployee();

  await db.theme.delete({
    where: { uuid: themeUuid },
  });

  revalidatePath("/settings");

  return { success: true } as const;
}
