import { Prisma } from "@mioto/prisma";
const { TokenType } = Prisma;
import {
  type ExcludeFailures,
  type ExtractFailures,
  Failure,
} from "@mioto/errors";
import { z } from "zod";
import { loadTokenFromDb } from "../../loadFromDb";
import { verifyToken } from "../../verify";
import { emailVerificationTokenSchema } from "./shared";
import type { DB } from "../../../../db/types";

export const verifyEmailVerificationToken =
  (db: DB) =>
  async ({ token }: TInput) => {
    const parsedPayload = await verifyToken(
      {
        token,
        type: TokenType.VERIFY_EMAIL,
      },
      emailVerificationTokenSchema,
    );

    if (parsedPayload instanceof Error) {
      return parsedPayload;
    }

    const tokenFromDb = await loadTokenFromDb(db)({
      token,
      userUuid: parsedPayload.userUuid,
      type: TokenType.VERIFY_EMAIL,
    });

    if (tokenFromDb instanceof Failure) {
      return tokenFromDb;
    }

    return {
      payload: parsedPayload,
      db: tokenFromDb,
    };
  };

export const verifyEmailVerificationTokenInput = z.object({
  token: z.string(),
});

export type TInput = z.infer<typeof verifyEmailVerificationTokenInput>;

export type TFailures = ExtractFailures<typeof verifyEmailVerificationToken>;

export type TData = ExcludeFailures<typeof verifyEmailVerificationToken>;

export type TOutput = Awaited<ReturnType<typeof verifyEmailVerificationToken>>;
