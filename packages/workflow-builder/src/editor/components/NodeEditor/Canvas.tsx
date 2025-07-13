"use client";

import * as React from "react";

import { LoadingSpinner } from "@mioto/design-system/LoadingSpinner";
import { Skeleton } from "@mioto/design-system/Skeleton";
import { Stack } from "@mioto/design-system/Stack";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import { FatalError } from "@mioto/errors";
import { Background, BackgroundVariant, type NodeProps } from "@xyflow/react";
import { motion } from "framer-motion";
import { mapValues } from "remeda";
import { isNodeId } from "../../../tree/id";
import { useTreeClient } from "../../../tree/sync/treeStore/TreeContext";
import { editorNodes } from "../../editorNodes";
import type { TCanvasNode } from "../../editorTreeClient";
import { sidebarWidth } from "../../utils/constants";
import { CustomEdge } from "./Canvas/Edges/CustomEdge";
import { ReactFlowCanvas } from "./Canvas/ReactFlowCanvas";

function NodeWrapper(Node: TCanvasNode) {
  return function RFNode({ id, ...props }: NodeProps) {
    if (!isNodeId(id)) throw new FatalError({ code: "invalid_node_id" });

    return <Node id={id} {...props} />;
  };
}

const canvasClasses = "grid justify-center h-full overflow-hidden isolate";

type NodeEditorProps = {
  className?: string;
  defaultViewport?: { x: number; y: number; zoom: number };
  treeUuid: string;
  isLoading?: boolean;
  children?: React.ReactNode;
};

export const Canvas = ({
  className,
  defaultViewport,
  isLoading,
  children,
}: NodeEditorProps) => {
  const { edgePlugins } = useTreeClient();

  const edgeTypes = React.useMemo(
    () => mapValues(edgePlugins, () => CustomEdge),
    [edgePlugins],
  );

  const nodeTypes = React.useMemo(
    () =>
      mapValues(editorNodes, (Node) => (Node ? NodeWrapper(Node) : () => null)),
    [],
  );

  if (isLoading) {
    return (
      <motion.div
        className={`relative justify-center justify-items-center h-full grid items-center ${className}`}
        style={{ gridTemplateRows: "1fr", gridTemplateColumns: "1fr" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        key="loading"
      >
        <Stack className="max-w-[500px] z-10 row-span-full col-span-full text-largeHeading">
          <LoadingSpinner className="fill-primary8" />
        </Stack>
        <Stack className="relative w-[600px] row-span-full col-span-full h-full">
          <Skeleton className="bg-gray3 w-[200px] h-[80px] rounded absolute top-[200px] left-[100px]" />
          <Skeleton className="bg-gray3 w-[200px] h-[80px] rounded absolute top-[330px] left-[350px]" />
          <Skeleton className="bg-gray3 w-[200px] h-[80px] rounded absolute top-[480px] left-[400px]" />
          <Skeleton className="bg-gray3 w-[200px] h-[80px] rounded absolute top-[480px] left-[50px]" />
          <Skeleton className="bg-gray3 w-[200px] h-[80px] rounded absolute top-[630px] left-[300px]" />
          <Skeleton className="bg-gray3 w-[200px] h-[80px] rounded absolute top-[780px] left-[200px]" />
          <Skeleton className="bg-gray3 w-[200px] h-[80px] rounded absolute top-[920px] left-[0px]" />
          <Skeleton className="bg-gray3 w-[200px] h-[80px] rounded absolute top-[1000px] left-[400px]" />
        </Stack>
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          color="#d3d5d5"
          size={2}
        />
      </motion.div>
    );
  }

  return (
    <ReactFlowCanvas
      className={className ? twMerge(canvasClasses, className) : canvasClasses}
      style={{ gridTemplateColumns: `1fr ${sidebarWidth}px` }}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultViewport={defaultViewport}
    >
      {children}
    </ReactFlowCanvas>
  );
};
