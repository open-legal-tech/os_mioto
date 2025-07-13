" use server";

import prisma from "@mioto/prisma";
import { enhance } from "@zenstackhq/runtime";
import { createAnonymusUserToken } from "../models/Token/subModels/AnonymusUserToken/create";

export const registerAnonymusUser = async ({
  orgSlug,
}: {
  orgSlug: string;
}) => {
  const anonymusUser = await prisma.user.create({
    data: {
      role: "ANONYMUS_USER",
      status: "ACTIVE",
      Organization: {
        connect: {
          slug: orgSlug,
        },
      },
    },
  });

  const userToken = await createAnonymusUserToken({
    userUuid: anonymusUser.uuid,
  });

  return {
    anonymusUser,
    userToken,
    db: enhance(prisma, { user: anonymusUser }),
  };
};
