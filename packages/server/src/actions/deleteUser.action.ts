"use server";

import { redirect } from "next/navigation";
import { removeTokenCookies } from "../db/checkAuthenticated";
import { getCurrentEmployee } from "../db/getCurrentEmployee";

export async function deleteAdminUserAction() {
  const { user, db } = await getCurrentEmployee();

  await db.organization.delete({
    where: {
      uuid: user.organizationUuid,
    },
  });

  await removeTokenCookies();

  redirect("/auth/login");
}
