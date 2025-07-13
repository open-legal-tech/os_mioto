import { Failure, FatalError } from "@mioto/errors";
import { copyFile } from "@mioto/server/File/copy";
import { removeFile } from "@mioto/server/File/remove";
import type { DB } from "@mioto/server/db/types";
import { UserInput } from "@mioto/server/utils/zodHelpers";
import { z } from "zod";
import { getTree } from "./getTree";

export const createSnapshotInput = UserInput.extend({
  treeUuid: z.string(),
});

export type TCreateSnapshotInput = z.infer<typeof createSnapshotInput>;

export const createSnapshot =
  (db: DB, token?: string) =>
  async ({ treeUuid, user }: TCreateSnapshotInput) => {
    const result = await getTree(db)({
      treeUuid,
      token,
    });

    if (!result.success) {
      return new Failure({
        code: "missing_tree_document",
      });
    }

    if (!result.data.treeData.startNode) {
      return new Failure({
        code: "missing_tree_start_node",
      });
    }

    const relatedTemplates = await db.template.findMany({
      where: {
        organizationUuid: user.organizationUuid,
        Trees: {
          some: {
            uuid: treeUuid,
          },
        },
      },
    });

    const snapshotedFiles = await Promise.all(
      relatedTemplates.map(
        async (template) =>
          await copyFile(db)({
            sourceUuid: template.fileUuid,
            orgUuid: user.organizationUuid,
          }),
      ),
    );

    // If any files are not copied, remove all copied files and throw error
    if (snapshotedFiles.some((file) => file instanceof Failure)) {
      await Promise.all(
        snapshotedFiles.map(async (snapshotedFile) => {
          if (snapshotedFile instanceof Failure) return;

          await removeFile(db)({
            uuid: snapshotedFile.destinationFile.uuid,
            orgUuid: user.organizationUuid,
          });
        }),
      );

      throw new FatalError({ code: "file_copying_failed" });
    }

    const validSnapshotFiles = snapshotedFiles as Exclude<
      (typeof snapshotedFiles)[number],
      Failure
    >[];

    const snapshot = await db.treeSnapshot.create({
      data: {
        document: result.data.tree.document,
        originTreeUuid: treeUuid,
        Template: {
          create: validSnapshotFiles.map((copiedTemplate) => ({
            fileUuid: copiedTemplate.destinationFile.uuid,
            organizationUuid: user.organizationUuid,
          })),
        },
      },
    });

    return {
      success: true,
      data: {
        snapshot: snapshot,
        templates: validSnapshotFiles,
      },
    };
  };
