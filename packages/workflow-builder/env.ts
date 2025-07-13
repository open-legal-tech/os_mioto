import { createEnv, zAppEnvs } from "@mioto/env/createEnv";
import { z } from "zod";

export const workflowBuilderEnv = createEnv({
  APP_ENV: zAppEnvs,
  SYNCSERVER_ENDPOINT: z.string(),
  SYNCSERVER_HTTP_ENDPOINT: z.string(),
  CLIENT_ENDPOINT: z.string(),
});
