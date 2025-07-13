"use server";

import { Failure, FatalError } from "@mioto/errors";
import prisma from "@mioto/prisma";
import { getAuthTokens } from "./auth";
import { hashPassword } from "../models/Auth/hasPassword";
import type { LegalDocumentVersions } from "../models/User/shared";

type Params = {
  password: string;
  legal: LegalDocumentVersions;
  userUuid: string;
};

export async function registerCustomer({ password, legal, userUuid }: Params) {
  const customer = await prisma.customer.findUnique({
    where: {
      userUuid: userUuid,
    },
    select: {
      userUuid: true,
      User: {
        select: { isBlocked: true },
      },
    },
  });

  if (!customer)
    return new Failure({
      code: "invite_not_found",
    });

  if (customer.User.isBlocked) {
    return new Failure({
      code: "user_blocked",
    });
  }

  const user = await prisma.account.update({
    where: {
      userUuid: customer.userUuid,
    },
    data: {
      emailIsVerified: true,
      password: await hashPassword(password),
      User: {
        update: {
          status: "ACTIVE",
        },
      },
      ...legal,
    },
    select: {
      userUuid: true,
      User: {
        select: {
          Organization: { select: { slug: true } },
        },
      },
    },
  });

  const tokens = await getAuthTokens(prisma)(user.userUuid);

  if (tokens instanceof Failure) {
    throw new FatalError({
      code: "impossible_error",
      debugMessage:
        "A user that was just created could not be found. This should not be able to happen.",
    });
  }

  return { tokens, user };
}
