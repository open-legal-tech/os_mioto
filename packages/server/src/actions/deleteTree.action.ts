"use server";

import { z } from "zod";
import { getCurrentEmployee } from "../db/getCurrentEmployee";
import { removeTree } from "../models/Tree/remove";

const deleteTreeInput = z.object({ treeUuid: z.string() });

type TDeleteTreeInput = z.infer<typeof deleteTreeInput>;

export async function deleteTreeAction(inputs: TDeleteTreeInput) {
  const {
    user,
    db,
    revalidatePath,
    redirect: orgRedirect,
  } = await getCurrentEmployee();
  const parsedInputs = deleteTreeInput.parse(inputs);

  await removeTree(db)({
    treeUuid: parsedInputs.treeUuid,
    employee: user,
  });

  revalidatePath(`/dashboard`);
  orgRedirect("/dashboard");
}
