import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { Prisma } from "@mioto/prisma";
const { TokenType } = Prisma;
import { z } from "zod";
import * as find from "./find";
import type { DB } from "../../db/types";

export const loadTokenFromDb =
  (db: DB) =>
  async ({ token, type, userUuid }: TInput) => {
    return await find.findToken(db)({
      token,
      userUuid,
      blacklisted: false,
      type,
    });
  };

export const loadTokenFromDbInput = z.object({
  token: z.string(),
  userUuid: z.string(),
  type: z.nativeEnum(TokenType),
});

export type TInput = z.infer<typeof loadTokenFromDbInput>;

export type TFailures = ExtractFailures<typeof loadTokenFromDb>;

export type TData = ExcludeFailures<typeof loadTokenFromDb>;

export type TOutput = Awaited<ReturnType<typeof loadTokenFromDb>>;
