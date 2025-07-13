import "server-only";
import type { DB } from "@mioto/server/db/types";
import { getTree } from "../../db/exports/getTree";
import type { RetrieveSessionFn } from "../../interpreter/exports/interpreter";
import type { TActionErrors } from "../../interpreter/exports/interpreterConfig";
import { createInterpreterMethods } from "../../interpreter/exports/methods";
import { TreeClient } from "../../tree/type/treeClient";
import { convertBufferToTreeDoc } from "../../tree/utils/exports/convertBufferToTreeDoc";
import type { TModuleVariableValue } from "../../variables/exports/types";

export const retrieveSessionFromTree =
  (db: DB, token: string): RetrieveSessionFn =>
  async ({ sessionUuid, treeUuid }) => {
    const session = await db.session.findUnique({
      where: { uuid: sessionUuid },
    });

    if (!session || !session.state) throw new Error("session_not_found");

    const tree = await getTree(db)({ treeUuid, token });

    if (!tree.success) throw new Error("treeSnapshot_not_found");

    const { treeMap } = convertBufferToTreeDoc(tree.data.tree.document);

    const treeClient = new TreeClient(tree.data.treeData, treeMap);

    const state =
      session.state as unknown as TModuleVariableValue<TActionErrors>;

    return {
      ...createInterpreterMethods(state, treeClient),
      session: { ...session, state },
      treeClient,
    };
  };
