import type { DB } from "@mioto/server/db/types";
import { convertBufferToTreeDoc } from "../../tree/utils/exports/convertBufferToTreeDoc";
import { createProxyFromYMap } from "../../tree/utils/exports/createProxyFromYMap";
import { workflowBuilderEnv } from "../../../env";

export const getTree =
  (db: DB) =>
  async ({ treeUuid, token }: { treeUuid: string; token?: string }) => {
    async function getTreeFromSyncServer() {
      if (token) {
        try {
          const response = await Promise.race([
            fetch(
              `${workflowBuilderEnv.SYNCSERVER_HTTP_ENDPOINT}/${treeUuid}`,
              {
                headers: {
                  method: "GET",
                  authorization: token,
                },
              },
            ),
            new Promise<undefined>((resolve) =>
              setTimeout(() => resolve(undefined), 10000),
            ),
          ]);

          if (response?.ok) {
            return Buffer.from(await response.arrayBuffer());
          }
        } catch (error) {
          console.log(error);
        }
      }

      return undefined;
    }

    const [tree, document] = await Promise.all([
      db.tree.findUnique({ where: { uuid: treeUuid } }),
      getTreeFromSyncServer(),
    ]);

    if (!tree) {
      return { success: false } as const;
    }

    if (document) {
      tree.document = document;
    }

    if (!tree.document) {
      return { success: false } as const;
    }

    const { treeMap } = convertBufferToTreeDoc(tree.document);
    const { store } = createProxyFromYMap(treeMap);

    return {
      success: true,
      data: {
        tree: { ...tree, document: tree.document },
        treeData: store,
        treeMap,
      },
    } as const;
  };
