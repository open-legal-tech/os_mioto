import "server-only";
import type { DB } from "@mioto/server/db/types";
import type { PersistSessionFn } from "../../interpreter/exports/interpreter";
import type { TModuleVariableValue } from "../../variables/exports/types";

export const persistSession =
  (db: DB): PersistSessionFn =>
  async ({ sessionUuid, history, variables, error }) => {
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
