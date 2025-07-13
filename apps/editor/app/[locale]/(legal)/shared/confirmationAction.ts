"use server";


import { checkAuthenticated } from "@mioto/server/db/checkAuthenticated";
import { revalidatePath } from "next/cache";
import type { LegalPages } from "../../../../content/legal";
import { redirect } from "../../../../i18n/routing";
import { getLocale } from "next-intl/server";

export async function updateAcceptedTerms({
  name,
  version,
}: {
  name: LegalPages;
  version: number;
}) {
  const locale = await getLocale();
  const { db, user } = await checkAuthenticated({
    onUnauthenticated: () => redirect({ href: "/auth/login", locale }),
  });

  await db.user.update({
    where: { uuid: user.uuid },
    data: {
      [`${name}Version`]: version,
    },
  });

  revalidatePath("/");
}
