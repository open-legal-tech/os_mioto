"use server";

import { createAnonymusUserToken } from "@mioto/server/Token/subModels/AnonymusUserToken/create";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { emptySession } from "@mioto/workflow-builder/constants";
import builderEnv from "../../../../../../../../../env";

export async function shareSessionAction({
  treeUuid,
  clientUuid,
  orgSlug,
}: {
  treeUuid: string;
  clientUuid: string;
  orgSlug: string;
}) {
  const { db } = await getCurrentEmployee();

  const tree = await db.tree.findUnique({
    where: {
      uuid: treeUuid,
    },
  });
  if (!tree) {
    throw new Error("Tree not found");
  }

  const session = await db.session.create({
    data: {
      name: `${new Date().toLocaleDateString()} ${tree.name}`,
      state: emptySession,
      status: "IN_PROGRESS",
      ownerUuid: clientUuid,
      treeUuid,
    },
  });

  const rendererToken = await createAnonymusUserToken({
    userUuid: clientUuid,
  });

  return {
    success: true,
    link: `${builderEnv.CLIENT_ENDPOINT}/org/${orgSlug}/render/${treeUuid}/${session.uuid}?token=${rendererToken.token}`,
  } as const;
}
