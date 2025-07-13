"use server";

import { registerAnonymusUser } from "../db/registerAnonymusUser";

export async function registerAnonymusUserAction({
  orgSlug,
}: {
  orgSlug: string;
}) {
  const { anonymusUser, db } = await registerAnonymusUser({
    orgSlug,
  });

  return {
    user: { ...anonymusUser, type: "anonymusUser" },
    db,
  } as const;
}
