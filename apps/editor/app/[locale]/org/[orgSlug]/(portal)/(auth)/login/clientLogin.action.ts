"use server";

import { loginAction } from "@mioto/server/actions/login.action";
import { getUnknownUser } from "@mioto/server/db/getUnknownUser";
import type { TLoginInput } from "@mioto/server/db/login";
import { notFound } from "next/navigation";

export async function clientLoginAction(
  input: TLoginInput & { orgSlug: string },
) {
  const { db } = await getUnknownUser();

  const org = await db.organization.findUnique({
    where: { slug: input.orgSlug },
  });

  if (!org) notFound();

  return await loginAction(input);
}
