"use server";

import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const inputs = z.object({
  name: z.string().optional(),
  theme: z.string().optional(),
});

export async function changeOrgSettingsAction(input: z.infer<typeof inputs>) {
  const { name, theme } = inputs.parse(input);

  const { db, user } = await getCurrentEmployee();

  await db.organization.update({
    where: { uuid: user.organizationUuid },
    data: { name, Theme: theme ? { connect: { uuid: theme } } : undefined },
  });

  revalidateTag(user.uuid);

  return { success: true } as const;
}
