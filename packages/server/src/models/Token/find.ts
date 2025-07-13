import { Prisma } from "@mioto/prisma";
const { TokenType } = Prisma;
import {
  type ExcludeFailures,
  type ExtractFailures,
  Failure,
} from "@mioto/errors";
import { z } from "zod";
import type { DB } from "../../db/types";

export const findToken = (db: DB) => async (input: TInput) => {
  const token = await db.token.findFirst({
    where: {
      ownerUuid: input.userUuid,
      type: input.type,
    },
  });

  if (!token) return new Failure({ code: "token_not_found" });

  return token;
};

export const findTokenInput = z.object({
  token: z.string(),
  type: z.nativeEnum(TokenType),
  blacklisted: z.boolean().optional(),
  userUuid: z.string(),
});

export type TInput = z.infer<typeof findTokenInput>;

export type TFailures = ExtractFailures<typeof findToken>;

export type TData = ExcludeFailures<typeof findToken>;

export type TOutput = Awaited<ReturnType<typeof findToken>>;
