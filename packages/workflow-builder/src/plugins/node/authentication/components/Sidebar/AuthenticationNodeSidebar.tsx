"use client";

import { useTranslations } from "@mioto/locale";
import { NodeSidebar } from "../../../../../editor/components/NodeSidebar";
import { SidebarLogic } from "../../../../../editor/components/SidebarLogic";
import type { TNodeSidebar } from "../../../../../editor/editorTreeClient";

export const AuthenticationNodeSidebar: TNodeSidebar = ({
  className,
  treeUuid,
}) => {
  const t = useTranslations();

  return (
    <NodeSidebar.Root
      className={className}
      tabs={[
        {
          key: "connections",
          label: t("plugins.node.authentication.sidebar.tabs.connections"),
        },
      ]}
      initialTab="connections"
      treeUuid={treeUuid}
    >
      <SidebarLogic value="connections" />
    </NodeSidebar.Root>
  );
};
