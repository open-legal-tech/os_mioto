"use server";

import type {
  RetrieveSessionFn,
  TInterpreterEnvironments,
} from "./exports/interpreter";
import { actions } from "./exports/interpreterConfig";

export async function executeNode({
  environment,
  treeUuid,
  sessionUuid,
  retrieveSession,
  userUuid,
  locale,
}: {
  sessionUuid: string;
  treeUuid: string;
  environment: TInterpreterEnvironments;
  retrieveSession: RetrieveSessionFn;
  userUuid: string;
  locale: string;
}) {
  async function executeNode() {
    const { getCurrentNode, session, treeClient, ...methods } =
      await retrieveSession({ sessionUuid, treeUuid });

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

  return { promise: executeNode() };
}
