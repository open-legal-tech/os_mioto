"use server";

import { z } from "zod";
import { getCurrentUser } from "../db/getCurrentUser";
import { updateEmail } from "../db/updateEmail";

const changeEmailInput = z.object({
  newEmail: z.string().email(),
});

type TChangeEmailInput = z.infer<typeof changeEmailInput>;

export async function changeEmailAction(inputs: TChangeEmailInput) {
  const parsedInputs = changeEmailInput.parse(inputs);

  const { user } = await getCurrentUser();

  return await updateEmail({
    newEmail: parsedInputs.newEmail,
    userUuid: user.uuid,
  });
}
