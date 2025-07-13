import type { DB } from "../../db/types";

export const getFile =
  (db: DB) =>
  async ({ uuid }: { uuid: string }) => {
    return db.file.findUnique({
      where: {
        uuid,
      },
    });
  };
