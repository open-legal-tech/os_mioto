import { createEnv } from "@mioto/env/createEnv";
import { z } from "zod";

export const testUtilsEnv = createEnv({
  MAILOSAUR_API_KEY: z.string().optional(),
  REGISTER_ACCESS_CODES: z
    .preprocess(
      (value) => typeof value === "string" && JSON.parse(value),
      z.array(z.string()),
    )
    .optional(),
});
