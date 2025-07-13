"use server";

import { z } from "zod";
import { getCurrentEmployee } from "../db/getCurrentEmployee";

const updateTreeInput = z.object({
  treeUuid: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

type TUpdateTreeInput = z.infer<typeof updateTreeInput>;

export async function updateTreeAction(inputs: TUpdateTreeInput) {
  const auth = await getCurrentEmployee();

  const parsedInputs = updateTreeInput.parse(inputs);

  await auth.db.tree.update({
    data: {
      name: parsedInputs.name,
      description: parsedInputs.description,
    },
    where: {
      organizationUuid: auth.user.organizationUuid,
      uuid: parsedInputs.treeUuid,
      Employee: {
        some: {
          userUuid: auth.user.uuid,
        },
      },
    },
  });

  auth.revalidatePath(`/dashboard`);

  return { success: true };
}
