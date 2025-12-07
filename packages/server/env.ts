import { createEnv, zAppEnvs } from "@mioto/env/createEnv";
import { z } from "zod";

export const serverModelsEnv = createEnv({
  ACCESS_TOKEN_SECRET: z.string().min(10),
  REFRESH_TOKEN_SECRET: z.string().min(10),
  JWT_ACCESS_EXPIRATION_MINUTES: z.coerce.number().min(1).default(15),
  JWT_REFRESH_EXPIRATION_DAYS: z.coerce.number().min(1).default(30),
  RESET_PASSWORD_EXPIRATION_MINUTES: z.coerce.number().min(1).default(30),
  VERIFY_EMAIL_EXPIRATION_MINUTES: z.coerce.number().min(1).default(30),
  FILE_UPLOAD_EXPIRATION_MINUTES: z.coerce.number().min(1).default(30),
  WITH_EMAIL_SERVICE: z
    .preprocess((value) => value === "true", z.boolean())
    .optional(),
  CONTACT_EMAIL: z.string().email().default("support@mioto.app"),
  REGISTER_ACCESS_CODES: z
    .preprocess(
      (value) => typeof value === "string" && JSON.parse(value),
      z.array(z.string()),
    )
    .optional(),
  AZURE_EMAIL_CONNECTION_STRING: z.string().min(1),
  CLIENT_ENDPOINT: z.string(),
  APP_ENV: zAppEnvs,
  AZURE_STORAGE_KEY: z.string(),
  AZURE_STORAGE_ACCOUNT: z.string(),
  AZURE_STORAGE_CONTAINER: z.string(),
});

export default serverModelsEnv;
