"use server";

import { Buffer } from "node:buffer";
import * as Y from "yjs";
import { getCurrentEmployee } from "../db/getCurrentEmployee";

export async function createTreeAction({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const { db, revalidatePath, user } = await getCurrentEmployee();

  const yDoc = new Y.Doc();

  const yMap = yDoc.getMap("tree");

  yMap.set("nodes", new Y.Map());
  yMap.set("edges", new Y.Map());

  const tree = await db.tree.create({
    data: {
      name,
      description,
      document: Buffer.from(Y.encodeStateAsUpdate(yDoc)),
      organizationUuid: user.organizationUuid,
      Employee: {
        connect: {
          userUuid: user.uuid,
        },
      },
    },
  });

  revalidatePath(`/dashboard`);

  return { success: true, data: { treeUuid: tree.uuid } } as const;
}
