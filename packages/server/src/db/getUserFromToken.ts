import prisma from "@mioto/prisma";
import { enhance } from "@zenstackhq/runtime";
import { verifyAccessToken } from "../models/Token/subModels/AccessToken/verify";

export const getUserFromToken = async (token: string) => {
  const result = await verifyAccessToken({ token });

  if (result instanceof Error) throw result;

  const user = await prisma.user.findUnique({
    where: { uuid: result.userUuid },
    include: {
      Organization: true,
      Customer: true,
      Employee: true,
    },
  });

  if (!user) throw new Error("User from token not found");

  return { user, db: enhance(prisma, { user }) };
};
