"use server";

import { Failure } from "@mioto/errors";
import { z } from "zod";
import { getCurrentUser } from "../db/getCurrentUser";
import { updateUserPassword } from "../models/User/updatePassword";

const changePasswordInput = z.object({
  newPassword: z.string(),
});

type TChangePasswordInput = z.infer<typeof changePasswordInput>;

export async function changePasswordAction(inputs: TChangePasswordInput) {
  const parsedInputs = changePasswordInput.parse(inputs);

  const { user, db } = await getCurrentUser();

  const result = await updateUserPassword(db)({
    newPassword: parsedInputs.newPassword,
    uuid: user.uuid,
  });

  if (result instanceof Failure)
    return { success: false, failure: result.body() } as const;

  return { success: true } as const;
}
