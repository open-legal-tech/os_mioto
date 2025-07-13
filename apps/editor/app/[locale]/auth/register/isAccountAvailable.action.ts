"use server";

import { Failure } from "@mioto/errors";
import { isAccountAvailable } from "@mioto/server/db/isAccountAvailable";
import { z } from "zod";

const zInputs = z.object({ email: z.string().email() });

export async function isAccountAvailableAction(
  inputs: z.infer<typeof zInputs>,
) {
  const { email } = zInputs.parse(inputs);

  const result = await isAccountAvailable({ email });

  if (result instanceof Failure)
    return { success: false, failure: result.body() } as const;

  return { success: true } as const;
}
