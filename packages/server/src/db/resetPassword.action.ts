"use server";

import prisma from "@mioto/prisma";
import { redirectToHome } from "../redirects/redirectToHome";
import { setTokenCookies } from "./checkAuthenticated";
import {
  type TResetPasswordInput,
  resetPasswordInput,
  resetPassword,
} from "../models/Auth/resetPassword";

export async function resetPasswordAction(inputs: TResetPasswordInput) {
  const parsedInputs = resetPasswordInput.parse(inputs);

  const result = await resetPassword(prisma)(parsedInputs);

  if (result instanceof Error)
    return { success: false, failure: result.body() };

  await setTokenCookies({
    access: result.tokens.access,
    refresh: result.tokens.refresh,
  });

  return redirectToHome();
}
