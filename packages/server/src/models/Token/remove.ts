import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { z } from "zod";
import type { DB } from "../../db/types";

export const removeToken =
  (db: DB) =>
  async ({ id }: TInput) => {
    return db.token.delete({
      where: {
        id,
      },
    });
  };

export const removeTokenInput = z.object({
  id: z.number(),
});

export type TInput = z.infer<typeof removeTokenInput>;

export type TFailures = ExtractFailures<typeof removeToken>;

export type TData = ExcludeFailures<typeof removeToken>;

export type TOutput = Awaited<ReturnType<typeof removeToken>>;
