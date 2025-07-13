"use server";

import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function revalidateTree({ treeUuid }: { treeUuid: string }) {
  const { revalidatePath } = await getCurrentEmployee();

  revalidatePath(`/builder/${treeUuid}`);
}
