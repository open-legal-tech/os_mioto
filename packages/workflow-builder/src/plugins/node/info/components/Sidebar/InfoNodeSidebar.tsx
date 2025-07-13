"use client";

import { useTranslations } from "@mioto/locale";
import { NodeSidebar } from "../../../../../editor/components/NodeSidebar";
import { SidebarLogic } from "../../../../../editor/components/SidebarLogic";
import type { TNodeSidebar } from "../../../../../editor/editorTreeClient";
import { InfoNodeSidebarContent } from "./InfoNodeSidebarContent";

export const InfoNodeSidebar: TNodeSidebar = ({ className, treeUuid }) => {
  const t = useTranslations();

  return (
    <NodeSidebar.Root
      className={className}
      tabs={[
        { label: t("plugins.node.form.info.tabs.content"), key: "content" },
        {
          label: t("plugins.node.form.info.tabs.connections"),
          key: "connections",
        },
      ]}
      initialTab="content"
      treeUuid={treeUuid}
    >
      <InfoNodeSidebarContent />
      <SidebarLogic value="connections" />
    </NodeSidebar.Root>
  );
};
