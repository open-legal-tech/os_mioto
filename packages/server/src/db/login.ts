import {
  type ExcludeFailures,
  type ExtractFailures,
  Failure,
} from "@mioto/errors";
import prisma from "@mioto/prisma";
import { isPasswordMatch } from "@mioto/server/Auth/isPasswordMatch";
import { z } from "zod";
import { generateAuthTokens } from "../models/Auth/generateAuthTokens";

export const login = async (input: TLoginInput) => {
  const account = await prisma.account.findFirst({
    where: {
      email: input.email,
    },
    select: {
      password: true,
      email: true,
      User: {
        select: {
          isBlocked: true,
          uuid: true,
          organizationUuid: true,
          Customer: {
            select: {
              userUuid: true,
            },
          },
          Employee: {
            select: {
              userUuid: true,
            },
          },
          Organization: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  if (
    !account?.password ||
    !(await isPasswordMatch(input.password, account?.password))
  ) {
    return new Failure({
      code: "incorrect_email_or_password",
    });
  }

  if (account.User.isBlocked) {
    return new Failure({
      code: "user_blocked",
    });
  }

  const newTokens = await generateAuthTokens(prisma)(
    account.User.uuid,
    account.User.Organization.slug,
  );

  return {
    orgSlug: account.User.Organization.slug,
    user: {
      uuid: account.User.uuid,
      // The order here matters, because an employee can have a customer, but not the other way around.
      type: account.User.Employee ? "employee" : "customer",
      email: account.email,
    },
    tokens: { ...newTokens, refresh: newTokens.refresh },
  };
};

export const loginInput = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(300),
});

export type TLoginInput = z.infer<typeof loginInput>;
export type TLoginFailures = ExtractFailures<typeof login>;
export type TLoginData = ExcludeFailures<typeof login>;
export type TLoginOutput = Awaited<ReturnType<typeof login>>;
