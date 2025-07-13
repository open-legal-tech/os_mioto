import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { z } from "zod";
import { EmployeeInput } from "../utils/zodHelpers";
import type { DB } from "../../db/types";

export const removeTree =
  (db: DB) =>
  async ({ employee, treeUuid }: TInput) => {
    await db.tree.delete({
      where: {
        uuid: treeUuid,
        organizationUuid: employee.organizationUuid,
        Employee: {
          some: {
            User: {
              role: employee.role,
              uuid: employee.uuid,
            },
          },
        },
      },
    });

    return { success: true };
  };

export const removeTreeInput = EmployeeInput.extend({
  treeUuid: z.string(),
});

export type TInput = z.infer<typeof removeTreeInput>;

export type TFailures = ExtractFailures<typeof removeTree>;

export type TData = ExcludeFailures<typeof removeTree>;

export type TOutput = Awaited<ReturnType<typeof removeTree>>;
