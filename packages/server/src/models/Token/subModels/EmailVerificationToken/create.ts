import { Prisma } from "@mioto/prisma";
const { TokenType } = Prisma;
import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { addMinutes } from "date-fns";
import { createToken } from "../../create";
import { saveTokenToDb } from "../../save";
import {
  type TEmailVerificationPayload,
  emailVerificationTokenSchema,
} from "./shared";
import serverModelsEnv from "../../../../../env";
import type { DB } from "../../../../db/types";

/**
 * Generate verify email token
 */
export const createEmailVerificationToken =
  (db: DB) =>
  async ({ userUuid, newsletter, previousEmail }: TInput) => {
    const expires = addMinutes(
      new Date(),
      serverModelsEnv.VERIFY_EMAIL_EXPIRATION_MINUTES,
    );

    const verifyEmailToken = await createToken({
      expiry: expires,
      type: TokenType.VERIFY_EMAIL,
      secret: serverModelsEnv.ACCESS_TOKEN_SECRET,
      payload: {
        userUuid,
        newsletter,
        previousEmail,
      } satisfies TEmailVerificationPayload,
    });

    await saveTokenToDb(db)({
      token: verifyEmailToken,
      userUuid,
      expiry: expires,
      type: TokenType.VERIFY_EMAIL,
    });

    return verifyEmailToken;
  };

export const createEmailVerificationTokenInput = emailVerificationTokenSchema;

export type TInput = TEmailVerificationPayload;

export type TFailures = ExtractFailures<typeof createEmailVerificationToken>;

export type TData = ExcludeFailures<typeof createEmailVerificationToken>;

export type TOutput = Awaited<ReturnType<typeof createEmailVerificationToken>>;
