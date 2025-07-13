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
import { refreshTokenSchema } from "./shared";
import type { DB } from "../../../../db/types";

export const verifyRefreshToken =
  (db: DB) =>
  async ({ token }: TInput) => {
    const parsedPayload = await verifyToken(
      { token, type: TokenType.REFRESH },
      refreshTokenSchema,
    );

    if (parsedPayload instanceof Error) {
      return parsedPayload;
    }

    const tokenFromDb = await loadTokenFromDb(db)({
      token,
      userUuid: parsedPayload.userUuid,
      type: TokenType.REFRESH,
    });

    if (tokenFromDb instanceof Failure) {
      return tokenFromDb;
    }

    return {
      payload: parsedPayload,
      db: tokenFromDb,
    };
  };

export const verifyRefreshTokenInput = z.object({
  token: z.string(),
});

export type TInput = z.infer<typeof verifyRefreshTokenInput>;

export type TFailures = ExtractFailures<typeof verifyRefreshToken>;

export type TData = ExcludeFailures<typeof verifyRefreshToken>;

export type TOutput = Awaited<ReturnType<typeof verifyRefreshToken>>;
