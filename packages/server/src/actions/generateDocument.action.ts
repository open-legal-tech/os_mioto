"use server";

import { Failure } from "@mioto/errors";
import { z } from "zod";
import { checkAuthWithAnonymus } from "../db/checkAuthenticated";
import { generateDocument } from "../models/Document/generate";

const generateDocumentActionInput = z.object({
  variables: z.object({}).passthrough(),
  templateUuid: z.string(),
  treeUuid: z.string().optional(),
  treeSnapshotUuid: z.string().optional(),
  userUuid: z.string(),
});

type TGenerateDocumentActionInput = z.infer<typeof generateDocumentActionInput>;

export async function generateDocumentAction(
  inputs: TGenerateDocumentActionInput,
) {
  const { variables, templateUuid, treeSnapshotUuid, treeUuid } =
    generateDocumentActionInput.parse(inputs);

  if (!treeUuid && !treeSnapshotUuid) {
    throw new Error("Either treeUuid or treeSnapshotUuid must be provided.");
  }

  const { db } = await checkAuthWithAnonymus(inputs.userUuid);

  const templateFromTree = treeSnapshotUuid
    ? await db.treeSnapshot.findUnique({
        where: {
          uuid: treeSnapshotUuid,
        },
        select: {
          Template: {
            where: {
              treeInternalUuid: templateUuid,
            },
          },
        },
      })
    : await db.tree.findUnique({
        where: {
          uuid: treeUuid,
        },
        select: {
          Template: {
            where: {
              treeInternalUuid: templateUuid,
            },
          },
        },
      });

  const template = templateFromTree?.Template[0];
  if (!template) return new Failure({ code: "template_not_found" });

  return await generateDocument(db)({
    fileUuid: template.fileUuid,
    variables: variables,
    orgUuid: template.organizationUuid,
  });
}
