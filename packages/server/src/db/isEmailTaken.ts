import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import prisma from "@mioto/prisma";
import { z } from "zod";

export const isEmailTaken = async ({ email }: TInput) => {
  const user = await prisma.user.findFirst({
    where: { Account: { email } },
  });

  if (user) return true;

  return false;
};

export const isEmailTakenInput = z.object({
  email: z.string().email(),
});

export type TInput = z.infer<typeof isEmailTakenInput>;

export type TFailures = ExtractFailures<typeof isEmailTaken>;

export type TData = ExcludeFailures<typeof isEmailTaken>;

export type TOutput = Awaited<ReturnType<typeof isEmailTaken>>;
