"use server";

import { z } from "zod";
import { getCurrentEmployee } from "../db/getCurrentEmployee";

const changeUserBlockedActionInput = z.object({
  customerUuid: z.string(),
  isBlocked: z.boolean(),
});

type ChangeUserBlockedActionInput = z.infer<
  typeof changeUserBlockedActionInput
>;

export async function changeUserBlockedAction(
  inputs: ChangeUserBlockedActionInput,
) {
  const { customerUuid, isBlocked } =
    changeUserBlockedActionInput.parse(inputs);

  const { db, revalidatePath } = await getCurrentEmployee();

  await db.user.update({
    where: { uuid: customerUuid },
    data: { isBlocked },
  });

  revalidatePath("/clients");
  revalidatePath("/client");
}
