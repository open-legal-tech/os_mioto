"use client";

import { useTranslations } from "@mioto/locale";
import { NodeSidebar } from "../../../../../editor/components/NodeSidebar";
import { SidebarLogic } from "../../../../../editor/components/SidebarLogic";
import type { TNodeSidebar } from "../../../../../editor/editorTreeClient";
import { ReportingNodeSidebarContent } from "./ReportingNodeSidebarContent";

export const ReportingNodeSidebar: TNodeSidebar = ({ className, treeUuid }) => {
  const t = useTranslations();

  return (
    <NodeSidebar.Root
      className={className}
      tabs={[
        { label: t("plugins.node.reporting.tabs.content"), key: "content" },
        {
          label: t("plugins.node.reporting.tabs.connections"),
          key: "connections",
        },
      ]}
      initialTab="content"
      treeUuid={treeUuid}
    >
      <ReportingNodeSidebarContent />
      <SidebarLogic value="connections" />
    </NodeSidebar.Root>
  );
};
