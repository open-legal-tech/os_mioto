"use server";

import { checkAuthWithAnonymus } from "@mioto/server/db/checkAuthenticated";

export async function getSessionAction({
  sessionUuid,
  userUuid,
}: {
  sessionUuid: string;
  userUuid: string;
}) {
  const { db } = await checkAuthWithAnonymus(userUuid);

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
  } as const;
}
