"use server";

import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function getSessionAction({
  sessionUuid,
}: { sessionUuid: string }) {
  const { db } = await getCurrentEmployee();

  const session = await db.session.findUnique({
    where: {
      uuid: sessionUuid,
    },
  });

  if (!session) {
    return { success: false, message: "Session not found" } as const;
  }

  return {
    success: true,
    data: {
      session,
    },
  };
}
