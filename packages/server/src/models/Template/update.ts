import {
  type ExcludeFailures,
  type ExtractFailures,
  Failure,
} from "@mioto/errors";
import { z } from "zod";
import { validateDocument } from "../Document/validate";
import { removeFile } from "../File/remove";
import { EmployeeInput } from "../utils/zodHelpers";
import { createFile } from "../File/create";
import type { DB } from "../../db/types";

export const updateTemplate =
  (db: DB) =>
  async ({
    treeInternalTemplateUuid,
    displayName,
    fileData: file,
    employee,
    treeUuid,
    extension,
    mime,
  }: TInput) => {
    const tree = await db.tree.findUnique({
      where: {
        uuid: treeUuid,
      },
      select: {
        Template: {
          where: {
            treeInternalUuid: treeInternalTemplateUuid,
          },
          select: {
            fileUuid: true,
          },
        },
        organizationUuid: true,
      },
    });

    const template = tree?.Template[0];
    if (!template) return new Failure({ code: "template_not_found" });

    if (!file) {
      return await db.template.update({
        where: {
          fileUuid: template.fileUuid,
          organizationUuid: employee.organizationUuid,
          Organization: {
            Users: {
              some: {
                role: employee.role,
                uuid: employee.uuid,
              },
            },
          },
        },
        data: {
          File: {
            update: {
              displayName,
            },
          },
        },
      });
    }

    const result = await createFile(db)({
      displayName: displayName,
      extension: extension,
      fileType: mime,
      fileData: file,
      orgUuid: tree.organizationUuid,
    });

    const verifiedTemplate = await validateDocument(db)({
      fileUuid: result.uuid,
      orgUuid: tree.organizationUuid,
    });

    if (verifiedTemplate instanceof Failure) {
      await removeFile(db)({ ...result, orgUuid: tree.organizationUuid });

      return verifiedTemplate;
    }

    return await db.template.update({
      where: {
        fileUuid: template.fileUuid,
        organizationUuid: employee.organizationUuid,
        Organization: {
          Users: {
            some: {
              role: employee.role,
              uuid: employee.uuid,
            },
          },
        },
      },
      data: {
        fileUuid: result.uuid,
      },
    });
  };

export const updateTemplateInput = EmployeeInput.extend({
  treeInternalTemplateUuid: z.string(),
  displayName: z.string(),
  treeUuid: z.string(),
  fileData: z.any(),
  extension: z.string(),
  mime: z.string(),
});

export type TInput = z.infer<typeof updateTemplateInput>;

export type TFailures = ExtractFailures<typeof updateTemplate>;

export type TData = ExcludeFailures<typeof updateTemplate>;

export type TOutput = Awaited<ReturnType<typeof updateTemplate>>;
