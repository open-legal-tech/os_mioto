"use server";

import { z } from "zod";
import { getCurrentEmployee } from "../db/getCurrentEmployee";

const changeTreeThemeActionInput = z.object({
  themeUuid: z.string(),
  treeUuid: z.string(),
});

type ChangeTreeThemeActionInput = z.infer<typeof changeTreeThemeActionInput>;

export async function changeTreeThemeAction(
  inputs: ChangeTreeThemeActionInput,
) {
  const { themeUuid, treeUuid } = changeTreeThemeActionInput.parse(inputs);

  const { db, revalidatePath } = await getCurrentEmployee();

  await db.tree.update({
    where: { uuid: treeUuid },
    data: { themeUuid },
  });

  revalidatePath(`/builder/${treeUuid}`);
}
