"use server";

import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function downloadThemeAction({
  themeUuid,
}: {
  themeUuid: string;
}) {
  const { db } = await getCurrentEmployee();

  const result = await db.theme.findUnique({
    where: {
      uuid: themeUuid,
    },
  });

  return { success: true, data: result } as const;
}
