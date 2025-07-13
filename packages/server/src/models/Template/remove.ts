import {
  type ExcludeFailures,
  type ExtractFailures,
  Failure,
} from "@mioto/errors";
import { z } from "zod";
import { removeFile } from "../File/remove";
import type { DB } from "../../db/types";

export const removeTemplate =
  (db: DB) =>
  async ({ treeInternalTemplateUuid, treeUuid }: TInput) => {
    const result = await db.tree.findUnique({
      where: {
        uuid: treeUuid,
      },
      select: {
        organizationUuid: true,
        Template: {
          where: {
            treeInternalUuid: treeInternalTemplateUuid,
          },
          select: {
            fileUuid: true,
          },
        },
      },
    });

    const template = result?.Template[0];
    if (!template) return new Failure({ code: "template_not_found" });

    return await removeFile(db)({
      uuid: template.fileUuid,
      orgUuid: result.organizationUuid,
    });
  };

export const removeTemplateInput = z.object({
  treeInternalTemplateUuid: z.string(),
  treeUuid: z.string(),
});

export type TInput = z.infer<typeof removeTemplateInput>;

export type TFailures = ExtractFailures<typeof removeTemplate>;

export type TData = ExcludeFailures<typeof removeTemplate>;

export type TOutput = Awaited<ReturnType<typeof removeTemplate>>;
