"use client";

import { useTranslations } from "@mioto/locale";
import { useSidebarContext } from "../../../../../editor/components/NodeEditor/Canvas/Sidebar";
import { NodeSidebar } from "../../../../../editor/components/NodeSidebar";
import { SidebarLogic } from "../../../../../editor/components/SidebarLogic";
import type { TNodeSidebar } from "../../../../../editor/editorTreeClient";
import { useTree } from "../../../../../tree/sync/state";
import { createReadableKey } from "../../../../../variables/exports/createReadableKey";
import { RecordVariable } from "../../../../../variables/exports/types";
import { TextInterpolationNode } from "../../plugin";
import { TextInterpolationSidebarContent } from "./NodeSidebarContent";

export const TextInterpolationNodeSidebar: TNodeSidebar = ({
  className,
  treeUuid,
}) => {
  const t = useTranslations();
  const nodeId = useSidebarContext();
  const variable = useTree(
    TextInterpolationNode.createVariable({ nodeId }),
  ).variable;

  const mainValue = RecordVariable.getMainValue(variable);

  const readableKey = mainValue
    ? createReadableKey([variable.name, mainValue.name])
    : undefined;

  return (
    <NodeSidebar.Root
      className={className}
      tabs={[
        {
          label: t("plugins.node.text-interpolation.tabs.content"),
          key: "content",
        },
        {
          label: t("plugins.node.text-interpolation.tabs.connections"),
          key: "connections",
        },
      ]}
      initialTab="content"
      treeUuid={treeUuid}
      variableKey={`{${readableKey}}`}
    >
      <TextInterpolationSidebarContent />
      <SidebarLogic value="connections" />
    </NodeSidebar.Root>
  );
};
