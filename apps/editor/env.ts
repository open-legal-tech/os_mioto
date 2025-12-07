import { createEnv, zAppEnvs } from "@mioto/env/createEnv";
import { z } from "zod";

export const builderEnv = createEnv({
  APP_ENV: zAppEnvs,
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_URL: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  GOTENBERG_ENDPOINT: z.string(),
  POSTHOG_TOKEN: z.string().optional(),
  REDIRECTS: z
    .preprocess(
      (value) => typeof value === "string" && JSON.parse(value),
      z.record(z.string()),
    )
    .optional(),
  MAINTENANCE_MODE: z.coerce.boolean(),
  MAINTENANCE_MODE_UNTIL: z.coerce.date().optional(),
  CLIENT_ENDPOINT: z.string(),
});

export default builderEnv;
