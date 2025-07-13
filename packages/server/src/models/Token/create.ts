import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { Prisma } from "@mioto/prisma";
import { getUnixTime } from "date-fns";
import dayjs from "dayjs";
import * as jose from "jose";
import { z } from "zod";

export const createToken = async ({
  expiry,
  payload,
  secret,
  type,
}: TInput) => {
  return await new jose.SignJWT({
    ...payload,
    type,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(getUnixTime(expiry))
    .setIssuedAt(dayjs().unix())
    .sign(new TextEncoder().encode(secret));
};

export const createTokenInput = z.object({
  expiry: z.date(),
  type: z.nativeEnum(Prisma.TokenType),
  secret: z.string(),
  payload: z.any(),
});

export type TInput = z.infer<typeof createTokenInput>;

export type TFailures = ExtractFailures<typeof createToken>;

export type TData = ExcludeFailures<typeof createToken>;

export type TOutput = Awaited<ReturnType<typeof createToken>>;
