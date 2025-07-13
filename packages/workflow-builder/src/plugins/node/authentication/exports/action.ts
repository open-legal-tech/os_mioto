"use server";

import { Failure } from "@mioto/errors";
import { checkAuthWithAnonymus } from "@mioto/server/db/checkAuthenticated";
import type { InterpreterActionParams } from "../../../../interpreter/exports/interpreterConfig";
import { AuthenticationNode } from "./plugin";

export const authenticationNodeAction = async ({
  nodeId,
  treeClient,
  session,
  userUuid,
}: InterpreterActionParams) => {
  const user = await checkAuthWithAnonymus(userUuid);

  return {
    type: "EVALUATE",
    nodeId,
    variable: AuthenticationNode.createVariable({
      nodeId,
      execution: user instanceof Failure ? "error" : "success",
      value:
        user instanceof Failure
          ? undefined
          : {
              email: user.user.Account?.email ?? undefined,
              firstName:
                user.user.Employee?.firstname ??
                user.user.Customer?.firstname ??
                undefined,
              lastName:
                user.user.Employee?.lastname ??
                user.user.Customer?.lastname ??
                undefined,
              referenceNumber:
                user.user.type === "customer"
                  ? user.user.Customer?.referenceNumber ?? undefined
                  : undefined,
              session: {
                name: session.name,
              },
            },
    })(treeClient).variable,
  } as const;
};
