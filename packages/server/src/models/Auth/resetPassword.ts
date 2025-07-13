import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { Prisma } from "@mioto/prisma";
import { z } from "zod";
import { removeAllTokensOfUser } from "../Token/removeAllOfUser";
import { verifyPasswordResetToken } from "../Token/subModels/ResetPasswordToken/verify";
import { updateUserPassword } from "../User/updatePassword";
import { generateAuthTokens } from "./generateAuthTokens";
import type { DB } from "../../db/types";

export const resetPasswordInput = z.object({
  token: z.string(),
  password: z.string(),
});

export const resetPassword = (db: DB) => async (input: TResetPasswordInput) => {
  const verifiedResetPasswordToken = await verifyPasswordResetToken(db)({
    token: input.token,
  });

  if (verifiedResetPasswordToken instanceof Error) {
    return verifiedResetPasswordToken;
  }

  const user = await db.user.findUnique({
    where: {
      uuid: verifiedResetPasswordToken.db.ownerUuid,
    },
    include: {
      Organization: { select: { slug: true } },
    },
  });

  if (!user) throw new Error("User from password reset token not found.");

  await updateUserPassword(db)({
    uuid: user.uuid,
    newPassword: input.password,
  });

  await removeAllTokensOfUser(db)({
    userUuid: verifiedResetPasswordToken.db.ownerUuid,
    type: Prisma.TokenType.REFRESH,
  });

  await removeAllTokensOfUser(db)({
    userUuid: verifiedResetPasswordToken.db.ownerUuid,
    type: Prisma.TokenType.RESET_PASSWORD,
  });

  const newTokens = await generateAuthTokens(db)(
    user.uuid,
    user.Organization.slug,
  );

  return {
    user,
    tokens: { ...newTokens, refresh: newTokens.refresh },
  };
};

export type TResetPasswordInput = z.infer<typeof resetPasswordInput>;

export type TResetPasswordFailures = ExtractFailures<typeof resetPassword>;

export type TResetPasswordData = ExcludeFailures<typeof resetPassword>;

export type TResetPasswordOutput = Awaited<ReturnType<typeof resetPassword>>;
