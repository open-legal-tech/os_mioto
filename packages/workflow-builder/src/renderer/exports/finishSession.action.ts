import "server-only";
import type { DB } from "@mioto/server/db/types";
import type { onSessionDoneFn } from "../../interpreter/exports/interpreter";

export const finishSession =
  (db: DB): onSessionDoneFn =>
  async ({ sessionUuid }) => {
    const result = await db.session.update({
      where: { uuid: sessionUuid },
      data: {
        status: "COMPLETED",
      },
    });

    if (result) return true;

    return false;
  };
