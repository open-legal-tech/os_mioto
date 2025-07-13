import { Prisma } from "@mioto/prisma";
const { TokenType } = Prisma;
import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { formatISO } from "date-fns";
import { z } from "zod";
import type { DB } from "../../db/types";

export const saveTokenToDb =
  (db: DB) =>
  async ({ expiry, token, type, userUuid, blacklisted }: TInput) => {
    return db.token.create({
      data: {
        token,
        expires: formatISO(expiry),
        ownerUuid: userUuid,
        type,
        blacklisted,
      },
    });
  };

export const saveTokenToDbInput = z.object({
  token: z.string(),
  userUuid: z.string(),
  expiry: z.date(),
  type: z.nativeEnum(TokenType),
  blacklisted: z.boolean().optional(),
});

export type TInput = z.infer<typeof saveTokenToDbInput>;

export type TFailures = ExtractFailures<typeof saveTokenToDb>;

export type TData = ExcludeFailures<typeof saveTokenToDb>;

export type TOutput = Awaited<ReturnType<typeof saveTokenToDb>>;
