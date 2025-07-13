"use client";

import { LoadingSpinner } from "@mioto/design-system/LoadingSpinner";
import { Sidebar as SystemSidebar } from "@mioto/design-system/Sidebar";
import { Stack } from "@mioto/design-system/Stack";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import React from "react";
import type { TNodeId } from "../../../../tree/id";
import type { TNodeSidebar } from "../../../editorTreeClient";
import { useTree } from "../../../exports/state";
import { useEditor, useEditorState } from "../../../useEditor";
import { useSelectedNodeIds } from "../../../useSelectedNodes";

const SidebarContext = React.createContext<TNodeId | undefined>(undefined);

export const useSidebarContext = () => {
  const nodeId = React.useContext(SidebarContext);

  if (!nodeId) {
    throw new Error(
      "useSidebarContext must be used within a SidebarContextProvider",
    );
  }

  return nodeId;
};

export type SidebarProps = {
  treeUuid: string;
  className?: string;
  Sidebars: Record<string, ReturnType<TNodeSidebar> | null>;
};

export function NodeSidebar({ className, Sidebars }: SidebarProps) {
  const { multiSelectionActive } = useEditor();
  const selectedNodeIds = useSelectedNodeIds();
  const nodeId =
    selectedNodeIds.length > 1 || multiSelectionActive
      ? undefined
      : selectedNodeIds[0];

  const selectedNodeType = useTree((treeClient) => {
    if (!nodeId) return undefined;

    if (treeClient.nodes.has(nodeId)) {
      const selectedNode = treeClient.nodes.get.single(nodeId);

      return selectedNode.type;
    }

    return undefined;
  });

  const { isDragging } = useEditorState();

  const SidebarContent = selectedNodeType ? Sidebars[selectedNodeType] : null;

  return (
    <SystemSidebar
      open={Boolean(nodeId && SidebarContent && !isDragging)}
      className={twMerge("bg-white col-[2] row-span-full z-10", className)}
    >
      <React.Suspense
        fallback={
          <Stack center className="h-full">
            <LoadingSpinner size="3em" />
          </Stack>
        }
      >
        {SidebarContent ? (
          <SidebarContext.Provider value={nodeId}>
            {SidebarContent}
          </SidebarContext.Provider>
        ) : null}
      </React.Suspense>
    </SystemSidebar>
  );
}
