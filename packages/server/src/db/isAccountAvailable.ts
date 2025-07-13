"use server";

import { Failure } from "@mioto/errors";
import prisma from "@mioto/prisma";

export async function isAccountAvailable({ email }: { email: string }) {
  const existingAccount = await prisma.account.findFirst({
    where: { email },
  });

  if (existingAccount) {
    return new Failure({
      code: "email_already_used",
    });
  }

  return { success: true };
}
