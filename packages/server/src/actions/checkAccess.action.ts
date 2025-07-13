"use server";

import {
  checkRegisterAccess,
  checkRegisterAccessInput,
  type TRegisterAccessInput,
} from "../models/Auth/registerAccess";

export async function checkRegisterAccessAction(inputs: TRegisterAccessInput) {
  const parsedInputs = checkRegisterAccessInput.parse(inputs);

  const result = await checkRegisterAccess(parsedInputs);

  return { success: result.canRegister };
}
