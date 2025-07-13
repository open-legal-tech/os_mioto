import { Prisma } from "@mioto/prisma";
const { TokenType } = Prisma;
import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { z } from "zod";
import { verifyToken } from "../../verify";
import { fileUploadTokenPayloadSchema } from "./shared";

export const verifyFileUploadToken = async ({ token }: TInput) => {
  const parsedPayload = await verifyToken(
    {
      token,
      type: TokenType.UPLOAD_FILE,
    },
    fileUploadTokenPayloadSchema,
  );

  return parsedPayload;
};

export const verifyFileUploadTokenInput = z.object({
  token: z.string(),
});

export type TInput = z.infer<typeof verifyFileUploadTokenInput>;

export type TFailures = ExtractFailures<typeof verifyFileUploadToken>;

export type TData = ExcludeFailures<typeof verifyFileUploadToken>;

export type TOutput = Awaited<ReturnType<typeof verifyFileUploadToken>>;
