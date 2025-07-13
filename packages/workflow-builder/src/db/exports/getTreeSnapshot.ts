import { dangerousFullAccessPrisma } from "@mioto/server/db/prisma";
import type { DB } from "@mioto/server/db/types";
import { fixYTree } from "../../tree/exports/fixYTree";

/**
 * This function disregards permissions and fixes the tree snapshot with system migrations.
 */
export const getTreeSnapshot =
  (db: DB) =>
  async ({ treeUuid }: { treeUuid: string }) => {
    const treeSnapshot = await db.treeSnapshot.findFirst({
      where: {
        originTreeUuid: treeUuid,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        document: true,
        uuid: true,
        OriginTree: {
          select: {
            name: true,
            uuid: true,
            Theme: true,
          },
        },
      },
    });

    if (!treeSnapshot || !treeSnapshot.document) return;

    const fixedDocument = await fixYTree(
      treeSnapshot.document,
      async (document) => {
        await dangerousFullAccessPrisma.treeSnapshot.update({
          where: {
            uuid: treeSnapshot.uuid,
          },
          data: {
            document: Buffer.from(document),
          },
        });
      },
    );

    return {
      ...treeSnapshot,
      document: fixedDocument.document,
      migrationStatus: fixedDocument.status,
      fixes: fixedDocument.fixes,
    };
  };
