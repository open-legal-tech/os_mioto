import { createEnv as libCreateEnv } from "@t3-oss/env-core";
import { z, type ZodType } from "zod";

export function createEnv<TVars extends Record<string, ZodType>>(vars: TVars) {
  return libCreateEnv<undefined, TVars>({
    server: vars as any,
    emptyStringAsUndefined: true,
    skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
    runtimeEnvStrict: Object.fromEntries(
      Object.entries(vars).map(([key, value]) => [key, process.env[key]]),
    ) as any,
  });
}

export const zAppEnvs = z.enum(["development", "production", "testing"]);
export type APP_ENV = z.infer<typeof zAppEnvs>;
