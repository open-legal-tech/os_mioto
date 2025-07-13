"use server";

import { z } from "zod";
import { getCurrentEmployee } from "../db/getCurrentEmployee";

const shareTreeActionInput = z.object({
  treeUuid: z.string(),
  isPublic: z.boolean(),
});

type TShareTreeActionInput = z.infer<typeof shareTreeActionInput>;

export async function shareTreeAction(inputs: TShareTreeActionInput) {
  const parsedInput = shareTreeActionInput.parse(inputs);

  const { user, db, revalidatePath } = await getCurrentEmployee();

  await db.tree.update({
    where: {
      uuid: parsedInput.treeUuid,
      organizationUuid: user.organizationUuid,
    },
    data: {
      isPublic: parsedInput.isPublic,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/builder");
}
