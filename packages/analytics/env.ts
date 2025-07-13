import { createEnv, zAppEnvs } from "@mioto/env/createEnv";
import { z } from "zod";

export const analyticsEnv = createEnv({
  POSTHOG_TOKEN: z.string().optional(),
  APP_ENV: zAppEnvs,
});
