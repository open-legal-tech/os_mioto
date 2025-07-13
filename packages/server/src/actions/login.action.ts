"use server";

import { Failure } from "@mioto/errors";
import { setTokenCookies } from "../db/checkAuthenticated";
import { type TLoginInput, login, loginInput } from "../db/login";

export async function loginAction(inputs: TLoginInput) {
  const parsedInputs = loginInput.safeParse(inputs);

  if (!parsedInputs.success) {
    return {
      success: false,
      failure: new Failure({ code: "incorrect_email_or_password" }).body(),
    } as const;
  }

  const result = await login(parsedInputs.data);

  if (result instanceof Failure)
    return { success: false, failure: result.body() } as const;

  await setTokenCookies({
    access: result.tokens.access,
    refresh: result.tokens.refresh,
  });

  return {
    success: true,
    data: {
      type: result.user.type,
      email: result.user.email,
      uuid: result.user.uuid,
      orgSlug: result.orgSlug,
    },
  } as const;
}
