"use client";

import { Stack } from "@mioto/design-system/Stack";
import { LogicConfigurator } from "../../../../editor/components/LogicUI";
import { useSidebarContext } from "../../../../editor/components/NodeEditor/Canvas/Sidebar";
import { NodeSidebar } from "../../../../editor/components/NodeSidebar";
import type { TNodeSidebar } from "../../../../editor/editorTreeClient";
import { useTree } from "../../../../tree/sync/state";
import { LogicNode } from "../plugin";

export const LogicNodeSidebar: TNodeSidebar = ({ className, treeUuid }) => {
  const nodeId = useSidebarContext();
  const node = useTree(LogicNode.getSingle(nodeId));

  return (
    <NodeSidebar.Root
      className={className}
      treeUuid={treeUuid}
      initialTab="always"
      tabs={[{ key: "always" }]}
    >
      <NodeSidebar.Tab value="always">
        <Stack className={node.final ? "opacity-50 pointer-events-none" : ""}>
          <LogicConfigurator />
        </Stack>
      </NodeSidebar.Tab>
    </NodeSidebar.Root>
  );
};
