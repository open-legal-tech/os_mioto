import { createEnv } from "@mioto/env/createEnv";
import { z } from "zod";

export const emailEnv = createEnv({
  CONTACT_EMAIL: z.string().email(),
  SENDER_EMAIL: z.string().email(),
  REGISTER_ACCESS_CODES: z
    .preprocess(
      (value) => typeof value === "string" && JSON.parse(value),
      z.array(z.string()),
    )
    .optional(),
  AZURE_EMAIL_CONNECTION_STRING: z.string().min(1),
  WITH_EMAIL_SERVICE: z.coerce
    .boolean({ coerce: true })
    .optional()
    .default(true),
  CLIENT_ENDPOINT: z.string(),
  DOCS_ENDPOINT: z.string(),
});
