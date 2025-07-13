"use server";

import { Failure } from "@mioto/errors";
import prisma from "@mioto/prisma";

export async function isOrgSlugAvailable({ orgSlug }: { orgSlug: string }) {
  const existingAccount = await prisma.organization.findFirst({
    where: {
      slug: orgSlug,
    },
  });

  if (existingAccount) {
    return new Failure({ code: "orgSlug_already_used" });
  }

  return { success: true };
}
