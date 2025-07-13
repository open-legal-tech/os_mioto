"use server";

import { getCurrentUser } from "@mioto/server/db/getCurrentUser";

export async function updateSessionClientLabelAction({
  orgSlug,
  sessionUuid,
  newSessionName,
}: {
  orgSlug: string;
  sessionUuid: string;
  newSessionName: string;
}) {
  const { db, user, revalidatePath } = await getCurrentUser({
    orgSlug,
  });

  await db.session.update({
    where: {
      uuid: sessionUuid,
      ownerUuid: user.uuid,
    },
    data: {
      userLabel: newSessionName,
    },
  });

  revalidatePath("/client", "layout");

  return { success: true } as const;
}
