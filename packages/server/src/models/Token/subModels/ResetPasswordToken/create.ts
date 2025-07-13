import { Prisma } from "@mioto/prisma";
import { addMinutes } from "date-fns";
const { TokenType } = Prisma;
import {
  type ExcludeFailures,
  type ExtractFailures,
  Failure,
} from "@mioto/errors";
import { z } from "zod";
import { createToken } from "../../create";
import { saveTokenToDb } from "../../save";
import type { TResetPasswordPayload } from "./shared";
import type { DB } from "../../../../db/types";
import serverModelsEnv from "../../../../../env";

/**
 * Generate reset password token
 */
export const createPasswordResetToken =
  (db: DB) =>
  async ({ email }: TInput) => {
    const user = await db.account.findFirst({ where: { email } });

    if (!user)
      return new Failure({
        code: "user_not_found",
      });

    const expires = addMinutes(
      new Date(),
      serverModelsEnv.RESET_PASSWORD_EXPIRATION_MINUTES,
    );

    const resetPasswordToken = await createToken({
      expiry: expires,
      type: TokenType.RESET_PASSWORD,
      secret: serverModelsEnv.ACCESS_TOKEN_SECRET,
      payload: { userUuid: user.userUuid } satisfies TResetPasswordPayload,
    });

    await saveTokenToDb(db)({
      token: resetPasswordToken,
      userUuid: user.userUuid,
      expiry: expires,
      type: TokenType.RESET_PASSWORD,
      blacklisted: false,
    });

    return resetPasswordToken;
  };

export const createPasswordResetTokenInput = z.object({
  email: z.string(),
});

export type TInput = z.infer<typeof createPasswordResetTokenInput>;

export type TFailures = ExtractFailures<typeof createPasswordResetToken>;

export type TData = ExcludeFailures<typeof createPasswordResetToken>;

export type TOutput = Awaited<ReturnType<typeof createPasswordResetToken>>;
