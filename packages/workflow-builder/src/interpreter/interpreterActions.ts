"use server";

import { checkAuthWithAnonymus } from "@mioto/server/db/checkAuthenticated";
import { retrieveSessionFromSnapshot } from "../renderer/exports/retrieveSessionFromSnapshot.action";
import { actions } from "./exports/interpreterConfig";
import type { TInterpreterEnvironments } from "./exports/interpreter";
import type {
  TModuleVariableHistory,
  TModuleVariableValue,
} from "../variables/dataTypes/ModuleVariable";

export async function executeNode({
  environment,
  treeUuid,
  sessionUuid,
  userUuid,
  locale,
}: {
  sessionUuid: string;
  treeUuid: string;
  environment: TInterpreterEnvironments;
  userUuid: string;
  locale: string;
}) {
  const { user, db } = await checkAuthWithAnonymus(userUuid);
  const { getCurrentNode, session, treeClient, ...methods } =
    await retrieveSessionFromSnapshot(db, user.uuid)(sessionUuid);

  const currentNode = getCurrentNode();
  const action = actions[currentNode.type];

  if (!action) {
    return { type: "EVALUATE" } as const;
  }

  return await action({
    environment,
    isModule: false,
    nodeId: currentNode.id,
    treeUuid,
    getCurrentNode,
    treeClient,
    session,
    userUuid,
    locale,
    ...methods,
  });
}

export const persistSessionAction = async ({
  userUuid,
  variables,
  sessionUuid,
  error,
  history,
}: {
  sessionUuid: string;
  history: { nodes: TModuleVariableHistory; position: number };
  error: string | undefined;
  variables?: string;
  userUuid: string;
}) => {
  const { db } = await checkAuthWithAnonymus(userUuid);
  variables = variables ? JSON.parse(variables) : undefined;
  await db.session.update({
    where: { uuid: sessionUuid },
    data: {
      state: {
        variables,
        history,
        error,
      } as unknown as TModuleVariableValue,
    },
  });

  return true;
};

export const finishSessionAction = async ({
  sessionUuid,
  userUuid,
}: {
  sessionUuid: string;
  userUuid: string;
}) => {
  const { db } = await checkAuthWithAnonymus(userUuid);

  const result = await db.session.update({
    where: { uuid: sessionUuid },
    data: {
      status: "COMPLETED",
    },
  });

  if (result) return true;

  return false;
};
