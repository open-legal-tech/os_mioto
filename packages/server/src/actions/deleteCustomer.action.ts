"use server";

import { z } from "zod";
import { getCurrentEmployee } from "../db/getCurrentEmployee";

const deleteCustomerActionInput = z.object({
  customerUuid: z.string(),
});

type DeleteCustomerActionInput = z.infer<typeof deleteCustomerActionInput>;

export async function deleteCustomerAction(inputs: DeleteCustomerActionInput) {
  const { customerUuid } = deleteCustomerActionInput.parse(inputs);

  const { db, revalidatePath } = await getCurrentEmployee();

  await db.user.delete({
    where: { uuid: customerUuid },
  });

  revalidatePath("/clients");
}
