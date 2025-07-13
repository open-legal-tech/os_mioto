"use server";

import { Failure } from "@mioto/errors";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { z } from "zod";
import { createSnapshot } from "../../../db/exports/createSnapshot";

const createSnapshotInput = z.object({
  treeUuid: z.string(),
});

type TCreateSnapshotInput = z.infer<typeof createSnapshotInput>;

export async function createSnapshotAction(input: TCreateSnapshotInput) {
  const { treeUuid } = createSnapshotInput.parse(input);

  const { db, user, revalidatePath, token } = await getCurrentEmployee();
  const result = await createSnapshot(db, token)({ treeUuid, user });

  if (result instanceof Failure)
    return { success: false, failure: result.body() } as const;

  revalidatePath(`/builder/${treeUuid}`);
  revalidatePath(`/dashboard`);
  revalidatePath(`/clients`);

  return { success: true } as const;
}
