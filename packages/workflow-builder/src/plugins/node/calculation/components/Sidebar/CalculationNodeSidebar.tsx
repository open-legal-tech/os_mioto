"use client";

import { useTranslations } from "@mioto/locale";
import { useSidebarContext } from "../../../../../editor/components/NodeEditor/Canvas/Sidebar";
import { NodeSidebar } from "../../../../../editor/components/NodeSidebar";
import { SidebarLogic } from "../../../../../editor/components/SidebarLogic";
import type { TNodeSidebar } from "../../../../../editor/editorTreeClient";
import { useTree } from "../../../../../tree/sync/state";
import { createReadableKey } from "../../../../../variables/exports/createReadableKey";
import { RecordVariable } from "../../../../../variables/exports/types";
import { CalculationNode } from "../../plugin";
import { CalculationNodeSidebarContent } from "./CalculationNodeSidebarContent";

export const CalculationNodeSidebar: TNodeSidebar = ({
  className,
  treeUuid,
}) => {
  const nodeId = useSidebarContext();
  const t = useTranslations();

  const variable = useTree((treeClient) =>
    CalculationNode.createVariable({ nodeId })(treeClient),
  ).variable;

  const mainValue = RecordVariable.getMainValue(variable);

  const mainValueName = mainValue ? mainValue.name : undefined;

  const readableKey = mainValueName
    ? createReadableKey([variable.name, mainValueName])
    : undefined;

  return (
    <NodeSidebar.Root
      className={className}
      tabs={[
        { label: t("plugins.node.calculation.tabs.content"), key: "content" },
        {
          label: t("plugins.node.calculation.tabs.connections"),
          key: "connections",
        },
      ]}
      initialTab="content"
      treeUuid={treeUuid}
      variableKey={`{${readableKey}}`}
    >
      <CalculationNodeSidebarContent />
      <SidebarLogic value="connections" />
    </NodeSidebar.Root>
  );
};
