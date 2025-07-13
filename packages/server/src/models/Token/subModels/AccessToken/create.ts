import { Prisma } from "@mioto/prisma";
const { TokenType } = Prisma;
import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { addMinutes, getUnixTime } from "date-fns";
import { z } from "zod";
import { createToken } from "../../create";
import type { TAccessTokenPayload } from "./shared";
import serverModelsEnv from "../../../../../env";

/**
 * Generate access token
 */
export const createAccessToken = async ({ userUuid, orgSlug }: TInput) => {
  const accessTokenExpires = addMinutes(
    new Date(),
    serverModelsEnv.JWT_ACCESS_EXPIRATION_MINUTES,
  );

  const accessToken = await createToken({
    expiry: accessTokenExpires,
    type: TokenType.ACCESS,
    secret: serverModelsEnv.ACCESS_TOKEN_SECRET,
    payload: { userUuid, orgSlug } satisfies TAccessTokenPayload,
  });

  return {
    token: accessToken,
    expires: getUnixTime(accessTokenExpires),
  };
};

export const createAccessTokenInput = z.object({
  userUuid: z.string(),
  orgSlug: z.string(),
});

export type TInput = z.infer<typeof createAccessTokenInput>;

export type TFailures = ExtractFailures<typeof createAccessToken>;

export type TData = ExcludeFailures<typeof createAccessToken>;

export type TOutput = Awaited<ReturnType<typeof createAccessToken>>;
