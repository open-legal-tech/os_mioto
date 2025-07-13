import {
  type ExcludeFailures,
  type ExtractFailures,
  FatalError,
} from "@mioto/errors";
import * as jose from "jose";
import { z } from "zod";
import serverModelsEnv from "../../../env";

const failed_token_verification = (error: any) =>
  new FatalError({
    code: "failed_token_verification",
    parentError: error,
  });

const invalidTokenPayload = (error: any) =>
  new FatalError({
    code: "invalid_token_payload",
    parentError: error,
  });

export const verifyToken = async <TSchema extends z.ZodType>(
  { token, type }: TInput,
  schema: TSchema,
): Promise<
  | (z.infer<TSchema> & { expires: number })
  | ReturnType<typeof failed_token_verification>
> => {
  const secret =
    type === "REFRESH"
      ? serverModelsEnv.REFRESH_TOKEN_SECRET
      : serverModelsEnv.ACCESS_TOKEN_SECRET;

  try {
    const payload = (
      await jose.jwtVerify(token, new TextEncoder().encode(secret))
    ).payload;

    const parsedPayload = schema.safeParse(payload);

    if (!parsedPayload.success) {
      console.log(parsedPayload.error.flatten());
      throw invalidTokenPayload(parsedPayload.error);
    }

    return { ...parsedPayload.data, expires: payload.exp };
  } catch (error) {
    console.log(error);
    return failed_token_verification(error);
  }
};

export const verifyTokenInput = z.object({
  token: z.string(),
  type: z.enum([
    "ACCESS",
    "REFRESH",
    "RESET_PASSWORD",
    "VERIFY_EMAIL",
    "UPLOAD_FILE",
    "ANONYMUS_USER",
  ]),
});

export type TInput = z.infer<typeof verifyTokenInput>;

export type TFailures = ExtractFailures<typeof verifyToken>;

export type TData = ExcludeFailures<typeof verifyToken>;

export type TOutput = Awaited<ReturnType<typeof verifyToken>>;
