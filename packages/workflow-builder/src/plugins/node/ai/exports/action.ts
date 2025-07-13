"use server";

import { checkAuthWithAnonymus } from "@mioto/server/db/checkAuthenticated";
import type { InterpreterActionParams } from "../../../../interpreter/exports/interpreterConfig";
import { decisionAINodeAction } from "../langchain/decisionAI";
import { extractionAINodeAction } from "../langchain/extractAI";
import { AINode, type IAINode } from "./plugin";

export const aiNodeAction = async ({
  nodeId,
  treeClient,
  userUuid,
  ...params
}: InterpreterActionParams) => {
  const auth = await checkAuthWithAnonymus(userUuid);
  const node = AINode.getSingle(nodeId)(treeClient);

  const actionParams = {
    nodeId,
    treeClient,
    node,
    userUuid,
    ...params,
    ...auth,
  };

  switch (node.aiType) {
    case "decision":
      return await decisionAINodeAction(actionParams);

    default:
      return await extractionAINodeAction(actionParams);
  }
};

export type ActionParams = InterpreterActionParams & {
  node: IAINode;
} & Awaited<ReturnType<typeof checkAuthWithAnonymus>>;
