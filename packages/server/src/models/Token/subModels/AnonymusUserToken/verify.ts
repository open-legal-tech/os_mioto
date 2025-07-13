import { Prisma } from "@mioto/prisma";
import { z } from "zod";
const { TokenType } = Prisma;
import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { verifyToken } from "../../verify";
import { anonymusUserTokenSchema } from "./shared";

export const verifyAnonymusUserToken = async ({ token }: TInput) => {
  const parsedPayload = await verifyToken(
    {
      token,
      type: TokenType.ANONYMUS_USER,
    },
    anonymusUserTokenSchema,
  );

  return parsedPayload;
};

export const verifyRendererSessionTokenInput = z.object({
  token: z.string(),
});

export type TInput = z.infer<typeof verifyRendererSessionTokenInput>;

export type TFailures = ExtractFailures<typeof verifyAnonymusUserToken>;

export type TData = ExcludeFailures<typeof verifyAnonymusUserToken>;

export type TOutput = Awaited<ReturnType<typeof verifyAnonymusUserToken>>;
