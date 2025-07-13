"use server";

import { getCurrentUser } from "@mioto/server/db/getCurrentUser";

export async function updateSessionNameAction({
  sessionUuid,
  sessionName,
}: {
  sessionUuid: string;
  sessionName: string;
  orgSlug: string;
}) {
  const { db } = await getCurrentUser();

  await db.session.update({
    where: {
      uuid: sessionUuid,
    },
    data: {
      name: sessionName,
    },
  });

  return { success: true } as const;
}
