"use server";

import { checkAuthenticated } from "@mioto/server/db/checkAuthenticated";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { emptySession } from "../../constants";

export async function createSessionAction({ treeUuid }: { treeUuid: string }) {
  const { db, user } = await checkAuthenticated({
    onUnauthenticated: () => redirect("/auth/login"),
  });

  await db.session.create({
    data: {
      name: "Session",
      status: "IN_PROGRESS",
      ownerUuid: user.uuid,
      treeUuid,
      state: emptySession,
    },
  });

  revalidatePath(`/org/${user.Organization.slug}/builder/${treeUuid}`);
}
