import { Prisma } from "@mioto/prisma";
const { TokenType } = Prisma;
import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { addDays, getUnixTime } from "date-fns";
import type { z } from "zod";
import { createToken } from "../../create";
import {
  type TAnonymusUserTokenPayload,
  anonymusUserTokenSchema,
} from "./shared";
import serverModelsEnv from "../../../../../env";

export const createAnonymusUserToken = async ({ userUuid }: TInput) => {
  const tokenExpires = addDays(new Date(), 999);

  const accessToken = await createToken({
    expiry: tokenExpires,
    type: TokenType.ACCESS,
    secret: serverModelsEnv.ACCESS_TOKEN_SECRET,
    payload: {
      userUuid,
    } satisfies TAnonymusUserTokenPayload,
  });

  return {
    token: accessToken,
    expires: getUnixTime(tokenExpires),
  };
};

export const createAnonymusUserTokenInput = anonymusUserTokenSchema;

export type TInput = z.infer<typeof createAnonymusUserTokenInput>;

export type TFailures = ExtractFailures<typeof createAnonymusUserToken>;

export type TData = ExcludeFailures<typeof createAnonymusUserToken>;

export type TOutput = Awaited<ReturnType<typeof createAnonymusUserToken>>;
