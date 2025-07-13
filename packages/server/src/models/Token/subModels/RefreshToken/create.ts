import { Prisma } from "@mioto/prisma";
const { TokenType } = Prisma;
import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { addDays, getUnixTime } from "date-fns";
import { z } from "zod";
import { createToken } from "../../create";
import { saveTokenToDb } from "../../save";
import type { TRefreshTokenPayload } from "./shared";
import type { DB } from "../../../../db/types";
import serverModelsEnv from "../../../../../env";

/**
 * Generate refresh token
 */
export const createRefreshToken =
  (db: DB) =>
  async ({ userUuid, orgSlug }: TInput) => {
    const refreshTokenExpires = addDays(
      new Date(),
      serverModelsEnv.JWT_REFRESH_EXPIRATION_DAYS,
    );

    const refreshToken = await createToken({
      expiry: refreshTokenExpires,
      type: TokenType.REFRESH,
      secret: serverModelsEnv.REFRESH_TOKEN_SECRET,
      payload: { userUuid, orgSlug } satisfies TRefreshTokenPayload,
    });

    const tokenInDb = await saveTokenToDb(db)({
      token: refreshToken,
      userUuid,
      expiry: refreshTokenExpires,
      type: TokenType.REFRESH,
    });

    return {
      token: refreshToken,
      expires: getUnixTime(refreshTokenExpires),
      tokenInDb,
    };
  };

export const createRefreshTokenInput = z.object({
  userUuid: z.string(),
  orgSlug: z.string(),
});

export type TInput = z.infer<typeof createRefreshTokenInput>;

export type TFailures = ExtractFailures<typeof createRefreshToken>;

export type TData = ExcludeFailures<typeof createRefreshToken>;

export type TOutput = Awaited<ReturnType<typeof createRefreshToken>>;
