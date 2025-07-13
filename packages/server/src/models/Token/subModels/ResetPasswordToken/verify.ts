import { Prisma } from "@mioto/prisma";
const { TokenType } = Prisma;
import {
  type ExcludeFailures,
  type ExtractFailures,
  Failure,
} from "@mioto/errors";
import { z } from "zod";
import * as loadFromDb from "../../loadFromDb";
import * as verifyToken from "../../verify";
import { resetPasswordSchema } from "./shared";
import type { DB } from "../../../../db/types";

export const verifyPasswordResetToken =
  (db: DB) =>
  async ({ token }: TInput) => {
    const parsedPayload = await verifyToken.verifyToken(
      {
        token,
        type: TokenType.RESET_PASSWORD,
      },
      resetPasswordSchema,
    );

    if (parsedPayload instanceof Error) {
      return parsedPayload;
    }

    const tokenFromDb = await loadFromDb.loadTokenFromDb(db)({
      token,
      userUuid: parsedPayload.userUuid,
      type: TokenType.RESET_PASSWORD,
    });

    if (tokenFromDb instanceof Failure) {
      return tokenFromDb;
    }

    return {
      payload: parsedPayload,
      db: tokenFromDb,
    };
  };

export const verifyPasswordResetTokenInput = z.object({
  token: z.string(),
});

export type TInput = z.infer<typeof verifyPasswordResetTokenInput>;

export type TFailures = ExtractFailures<typeof verifyPasswordResetToken>;

export type TData = ExcludeFailures<typeof verifyPasswordResetToken>;

export type TOutput = Awaited<ReturnType<typeof verifyPasswordResetToken>>;
