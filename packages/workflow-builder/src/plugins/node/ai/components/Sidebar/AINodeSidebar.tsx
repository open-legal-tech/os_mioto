"use client";

import { useTranslations } from "@mioto/locale";
import { NodeSidebar } from "../../../../../editor/components/NodeSidebar";
import { SidebarLogic } from "../../../../../editor/components/SidebarLogic";
import type { TNodeSidebar } from "../../../../../editor/editorTreeClient";
import { AINodeSidebarContent } from "./AINodeSidebarContent";

export const AINodeSidebar: TNodeSidebar = ({ className, treeUuid }) => {
  const t = useTranslations();

  return (
    <NodeSidebar.Root
      className={className}
      tabs={[
        { label: t("plugins.node.AI.tabs.content"), key: "configuration" },
        { label: t("plugins.node.AI.tabs.connections"), key: "connections" },
      ]}
      initialTab="configuration"
      treeUuid={treeUuid}
    >
      <AINodeSidebarContent />
      <SidebarLogic value="connections" />
    </NodeSidebar.Root>
  );
};
