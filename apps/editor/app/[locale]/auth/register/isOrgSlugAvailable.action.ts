"use server";

import { Failure } from "@mioto/errors";
import { isOrgSlugAvailable } from "@mioto/server/db/isOrgSlugAvailable";
import { z } from "zod";

const zInputs = z.object({ orgSlug: z.string() });

export async function isOrgSlugAvailableAction(
  inputs: z.infer<typeof zInputs>,
) {
  const { orgSlug } = zInputs.parse(inputs);

  const result = await isOrgSlugAvailable({ orgSlug });

  if (result instanceof Failure)
    return { success: false, failure: result.body() } as const;

  return { success: true } as const;
}
