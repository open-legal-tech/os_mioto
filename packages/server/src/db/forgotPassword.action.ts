"use server";

import { Failure } from "@mioto/errors";
import prisma from "@mioto/prisma";
import {
  type TForgotPasswordInput,
  forgotPasswordInput,
  forgotPassword,
} from "../models/Auth/forgotPassword";

export async function forgotPasswordAction(inputs: TForgotPasswordInput) {
  const parsedInputs = forgotPasswordInput.parse(inputs);

  const result = await forgotPassword(prisma)(parsedInputs);

  if (result instanceof Failure)
    return { success: false, failure: result.body() } as const;

  return { success: true } as const;
}
