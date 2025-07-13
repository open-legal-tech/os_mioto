import {
  type ExcludeFailures,
  type ExtractFailures,
  Failure,
} from "@mioto/errors";
import { z } from "zod";
import { validateDocument } from "../Document/validate";
import { removeFile } from "../File/remove";
import { EmployeeInput } from "../utils/zodHelpers";
import type { DB } from "../../db/types";

export const createTemplate =
  (db: DB) =>
  async ({ treeUuid, employee, fileUuid }: TInput) => {
    const file = await db.file.findUnique({
      where: {
        uuid: fileUuid,
      },
    });

    if (!file) {
      return new Failure({ code: "file_not_found" });
    }

    const verifiedTemplate = await validateDocument(db)({
      fileUuid: file.uuid,
      orgUuid: employee.organizationUuid,
    });

    if (verifiedTemplate instanceof Failure) {
      await removeFile(db)({
        uuid: file.uuid,
        orgUuid: employee.organizationUuid,
      });

      return verifiedTemplate;
    }

    const documentTemplate = await db.template.create({
      data: {
        Organization: {
          connect: {
            uuid: employee.organizationUuid,
          },
        },
        File: {
          connect: {
            uuid: file.uuid,
          },
        },
        Trees: {
          connect: {
            uuid: treeUuid,
          },
        },
      },
    });

    return documentTemplate;
  };

export const createTemplateInput = EmployeeInput.extend({
  treeUuid: z.string(),
  fileUuid: z.string(),
});

export type TInput = z.infer<typeof createTemplateInput>;

export type TFailures = ExtractFailures<typeof createTemplate>;

export type TData = ExcludeFailures<typeof createTemplate>;

export type TOutput = Awaited<ReturnType<typeof createTemplate>>;
