"use server";

import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function updatePortalAccess({
  clientUuid,
  newPortalAccess,
}: {
  clientUuid: string;
  newPortalAccess: boolean;
}) {
  const { db, revalidatePath } = await getCurrentEmployee();

  await db.customer.update({
    where: {
      userUuid: clientUuid,
    },
    data: {
      hasPortalAccess: newPortalAccess,
    },
  });

  revalidatePath("/clients");
  revalidatePath("/client");
}
