import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { Prisma } from "@mioto/prisma";
const { TokenType } = Prisma;
import { z } from "zod";
import type { DB } from "../../db/types";

export const removeAllTokensOfUser =
  (db: DB) =>
  async ({ type, userUuid }: TInput) => {
    return db.token.deleteMany({
      where: {
        ownerUuid: userUuid,
        type,
      },
    });
  };

export const removeAllTokensOfUserInput = z.object({
  userUuid: z.string(),
  type: z.nativeEnum(TokenType),
});

export type TInput = z.infer<typeof removeAllTokensOfUserInput>;

export type TFailures = ExtractFailures<typeof removeAllTokensOfUser>;

export type TData = ExcludeFailures<typeof removeAllTokensOfUser>;

export type TOutput = Awaited<ReturnType<typeof removeAllTokensOfUser>>;
