"use server";

import { Failure } from "@mioto/errors";
import { setTokenCookies } from "../db/checkAuthenticated";
import {
  type TRegisterInput,
  register,
  registerInput,
} from "../db/registerAdmin";

export async function registerAction(inputs: TRegisterInput) {
  const parsedInputs = registerInput.parse(inputs);

  const result = await register(parsedInputs);

  if (result instanceof Failure)
    return { success: false, failure: result.body() } as const;

  await setTokenCookies({
    access: result.tokens.access,
    refresh: result.tokens.refresh,
  });

  return {
    success: true,
    data: {
      uuid: result.user.uuid,
      email: result.user.Account.email,
      orgSlug: result.org.slug,
    },
  } as const;
}
