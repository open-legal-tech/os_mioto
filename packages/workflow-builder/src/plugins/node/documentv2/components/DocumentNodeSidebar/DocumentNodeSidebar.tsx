import { getTranslations } from "@mioto/locale/server";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { fromEntries, isDefined } from "remeda";
import { getTree } from "../../../../../db/exports/getTree";
import { NodeSidebarRoot } from "../../../../../editor/components/NodeSidebar";
import { SidebarLogic } from "../../../../../editor/components/SidebarLogic";
import { TreeClient } from "../../../../../tree/type/treeClient";
import { DocumentNode } from "../../plugin";
import { DocumentNodeSidebarContent } from "./DocumentNodeSidebarContent";
import { getTemplate } from "./getTemplate";

export async function DocumentNodeSidebar({ treeUuid }: { treeUuid: string }) {
  const t = await getTranslations();
  const { db, token } = await getCurrentEmployee();

  const result = await getTree(db)({
    treeUuid,
    token,
  });

  if (!result.success) {
    return null;
  }

  const treeClient = new TreeClient(result.data.treeData, result.data.treeMap);

  const documentNodes = DocumentNode.getAll(treeClient);

  const files = fromEntries(
    (
      await Promise.all(
        Object.entries(documentNodes).map(async ([key, node]) => {
          if (!node.templateUuid) return;

          const file = await getTemplate({
            treeInternalTemplateUuid: node.templateUuid,
            treeUuid,
          });

          if (!file.success) return;

          return node.templateUuid ? [key, file.data.displayName] : undefined;
        }),
      )
    ).filter((x): x is [string, string] => isDefined(x)),
  );


  return (
    <NodeSidebarRoot
      tabs={[
        { label: t("plugins.node.document.tabs.content"), key: "content" },
        {
          label: t("plugins.node.document.tabs.connections"),
          key: "connections",
        },
      ]}
      initialTab="content"
      treeUuid={treeUuid}
    >
      <DocumentNodeSidebarContent files={files} treeUuid={treeUuid} />
      <SidebarLogic value="connections" />
    </NodeSidebarRoot>
  );
}
