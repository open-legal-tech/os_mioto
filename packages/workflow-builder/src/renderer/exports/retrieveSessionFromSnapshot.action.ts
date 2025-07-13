import "server-only";
import type { DB } from "@mioto/server/db/types";
import { getTreeSnapshot } from "../../db/exports/getTreeSnapshot";
import type { RetrieveSessionFn } from "../../interpreter/exports/interpreter";
import type { TActionErrors } from "../../interpreter/exports/interpreterConfig";
import { createInterpreterMethods } from "../../interpreter/exports/methods";
import { TreeClient } from "../../tree/type/treeClient";
import type { TTree } from "../../tree/type/type-classes/Tree";
import { convertBufferToTreeDoc } from "../../tree/utils/exports/convertBufferToTreeDoc";
import type { TModuleVariableValue } from "../../variables/exports/types";

export const retrieveSessionFromSnapshot =
  (db: DB, userUuid: string): RetrieveSessionFn =>
  async ({ sessionUuid }) => {
    const session = await db.session.findUnique({
      where: { uuid: sessionUuid, ownerUuid: userUuid },
      select: {
        treeUuid: true,
        state: true,
        uuid: true,
        name: true,
        status: true,
        ownerUuid: true,
        treeSnapshotUuid: true,
        Owner: {
          select: {
            organizationUuid: true,
          },
        },
      },
    });

    if (!session) throw new Error("session_not_found");

    const treeSnapshot = await getTreeSnapshot(db)({
      treeUuid: session.treeUuid,
    });

    if (!treeSnapshot) throw new Error("treeSnapshot_not_found");

    const { treeMap } = convertBufferToTreeDoc(treeSnapshot.document);

    const tree = treeMap.toJSON();
    const treeClient = new TreeClient(tree as TTree, treeMap);

    const state =
      session.state as unknown as TModuleVariableValue<TActionErrors>;

    return {
      ...createInterpreterMethods(state, treeClient),
      session: { ...session, state },
      treeClient,
    };
  };
