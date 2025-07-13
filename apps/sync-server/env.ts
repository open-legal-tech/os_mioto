import { createEnv } from "@mioto/env/createEnv";
import { z } from "zod";

export const syncServerEnv = createEnv({
  SENTRY_DSN: z.string().optional(),
  PORT: z.coerce.number().default(8081),
});
