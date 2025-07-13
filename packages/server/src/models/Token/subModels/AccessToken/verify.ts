import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { z } from "zod";
import { verifyToken } from "../../verify";
import { accessTokenSchema } from "./shared";

export const verifyAccessToken = async ({ token }: TInput) => {
  const parsedPayload = await verifyToken(
    {
      token,
      type: "ACCESS",
    },
    accessTokenSchema,
  );

  return parsedPayload;
};

export const verifyAccessTokenInput = z.object({
  token: z.string(),
});

export type TInput = z.infer<typeof verifyAccessTokenInput>;

export type TFailures = ExtractFailures<typeof verifyAccessToken>;

export type TData = ExcludeFailures<typeof verifyAccessToken>;

export type TOutput = Awaited<ReturnType<typeof verifyAccessToken>>;
