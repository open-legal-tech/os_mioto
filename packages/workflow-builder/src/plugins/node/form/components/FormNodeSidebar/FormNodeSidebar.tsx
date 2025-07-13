"use client";

import { useTranslations } from "@mioto/locale";
import { NodeSidebar } from "../../../../../editor/components/NodeSidebar";
import { SidebarLogic } from "../../../../../editor/components/SidebarLogic";
import type { TNodeSidebar } from "../../../../../editor/editorTreeClient";
import { FormNodeSidebarContent } from "./FormNodeSidebarContent";

export const FormNodeSidebar: TNodeSidebar = ({ className, treeUuid }) => {
  const t = useTranslations();

  return (
    <NodeSidebar.Root
      className={className}
      tabs={[
        { label: t("plugins.node.form.tabs.content"), key: "content" },
        { label: t("plugins.node.form.tabs.connections"), key: "connections" },
      ]}
      initialTab="content"
      treeUuid={treeUuid}
    >
      <FormNodeSidebarContent />
      <SidebarLogic value="connections" />
    </NodeSidebar.Root>
  );
};
