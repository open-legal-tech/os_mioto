"use client";

import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { Notification } from "@mioto/design-system/Notification";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import { Failure } from "@mioto/errors";
import { useTranslations } from "@mioto/locale";
import {
  Background,
  BackgroundVariant,
  type Connection,
  type EdgeChange,
  type EdgeTypes,
  type NodeChange,
  type NodeRemoveChange,
  type NodeTypes,
  type OnConnectEnd,
  type OnConnectStart,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import type { OnConnect } from "@xyflow/react";
import { motion } from "framer-motion";
import * as React from "react";
import { ComplexLogicEdge } from "../../../../plugins/edge/complex-logic/exports/plugin";
import { type TNodeId, ZEdgeId, ZNodeId } from "../../../../tree/id";
import { useTree, useTreeClient } from "../../../../tree/sync/state";
import type {
  INode,
  NodePlugin,
} from "../../../../tree/type/plugin/NodePlugin";
import { useRFEdges } from "../../../state/useRFEdges";
import { useRFNodes } from "../../../state/useRFNodes";
import { useEditor } from "../../../useEditor";
import { nodeWidth } from "../../../utils/constants";
import { NodeDropdownContent } from "../../NodeDropdown";
import { ConnectionLine } from "./Edges/ConnectionLine";
import { EditorToolbar } from "./EditorToolbar";
import { NodeDeletionDialog } from "./NodeDeletionDialog";
import "./canvas.css";

const fitViewOptions = { maxZoom: 1, minZoom: 0.3, padding: 1 };
const canvasStyle = {
  gridColumn: "1 / -1",
  gridRow: "1 / -1",
  isolation: "isolate",
  overflow: "hidden",
} as const;
const containerClasses = "grid h-full w-full relative bg-gray2";

const isNodeId = (id: string | null): id is TNodeId =>
  ZNodeId.safeParse(id).success;

type Props = {
  children?: React.ReactNode;
  className?: string;
  nodeTypes: NodeTypes;
  edgeTypes: EdgeTypes;
  defaultViewport?: { x: number; y: number; zoom: number };
  style?: React.CSSProperties;
};

export function ReactFlowCanvas({
  children,
  className,
  nodeTypes,
  edgeTypes,
  defaultViewport,
  style,
}: Props) {
  const t = useTranslations();

  const { treeClient } = useTreeClient();
  const [isDialogOpen, setIsDialogOpen] = React.useState<
    | undefined
    | {
        canvasCoordinates: { x: number; y: number };
        pageCoordinates: { x: number; y: number };
      }
  >(undefined);

  const nodes = useRFNodes();
  const edges = useRFEdges();

  const startNodeId = useTree((treeClient) => treeClient.get.startNodeId());

  const {
    closeNodeEditingSidebar,
    addSelectedNodes,
    removeSelectedNode,
    addSelectedEdges,
    removeSelectedEdge,
    reactFlowWrapperRef,
    removeSelectedNodes,
    setNodesToDelete,
    startConnecting,
    editorStore,
    abortConnecting,
    startDragging,
    stopDragging,
  } = useEditor();

  const connectToNode = React.useCallback(
    (connection: Connection) => {
      const sourceNode = treeClient.nodes.get.single(
        connection.source as TNodeId,
      );

      const targetNodeId = connection.target as TNodeId;

      const targetNode = treeClient.nodes.get.single(targetNodeId);

      const newEdge = ComplexLogicEdge.create({
        source: sourceNode.id,
        target: targetNode.id,
      })(treeClient);

      if (newEdge instanceof Failure) {
        if (
          newEdge.code === "circular_connection" ||
          newEdge.code === "duplicate_edge"
        )
          return Notification.add({
            Title: t(`app.editor.errors.${newEdge.code}.short`),
            Content: t(`app.editor.errors.${newEdge.code}.long`),
            variant: "danger",
          });

        return;
      }

      treeClient.edges.add(newEdge);
    },
    [t, treeClient],
  );

  const onConnectStart = React.useCallback<OnConnectStart>(
    (_, { nodeId }) => {
      if (isNodeId(nodeId)) {
        startConnecting(nodeId);
      }
    },
    [startConnecting],
  );

  const onConnect = React.useCallback<OnConnect>(
    (connection) => {
      connectToNode(connection);
      abortConnecting();
    },
    [abortConnecting, connectToNode],
  );

  const onConnectEnd = React.useCallback<OnConnectEnd>(
    (event) => {
      if (!editorStore.connectingNodeId) return;
      if (!(event.target instanceof Element)) return;

      const targetNodeId = event.target.getAttribute(
        "data-nodeid",
      ) as TNodeId | null;

      if (targetNodeId) {
        connectToNode({
          source: editorStore.connectingNodeId,
          target: targetNodeId,
          sourceHandle: null,
          targetHandle: null,
        });
        abortConnecting();
      }

      const isCanvas = event.target.classList.contains("react-flow__pane");

      const connectingNodeId = editorStore.connectingNodeId;

      if (!isCanvas || !connectingNodeId) return;

      const canvasRect = reactFlowWrapperRef.current?.getBoundingClientRect();

      if (!canvasRect) return;

      const pageCoordinates =
        event instanceof MouseEvent
          ? { x: event.offsetX, y: event.offsetY }
          : {
              x: event.touches[0]?.screenX ?? 0,
              y: event.touches[0]?.screenY ?? 0,
            };

      const canvasCoordinates =
        event instanceof MouseEvent
          ? { x: event.clientX, y: event.clientY }
          : {
              x: event.touches[0]?.clientX ?? 0,
              y: event.touches[0]?.clientY ?? 0,
            };

      setIsDialogOpen({ pageCoordinates, canvasCoordinates });
    },
    [
      abortConnecting,
      connectToNode,
      editorStore.connectingNodeId,
      reactFlowWrapperRef,
    ],
  );

  const onNodeChange = React.useCallback(
    (nodeChanges: NodeChange[]) => {
      const nodesToDelete = nodeChanges
        .filter(
          (change): change is Omit<NodeRemoveChange, "id"> & { id: TNodeId } =>
            change.type === "remove" &&
            change.id !== startNodeId &&
            isNodeId(change.id),
        )
        .map((change) => change.id);

      if (nodesToDelete.length > 0) {
        setNodesToDelete(nodesToDelete);
        removeSelectedNodes();
      }

      nodeChanges.forEach((nodeChange) => {
        if (nodeChange.type === "remove" && nodeChange.id === startNodeId) {
          Notification.add({
            Title: t("app.editor.canvas.notification.delete-start-node.title"),
            variant: "warning",
          });
        }

        switch (nodeChange.type) {
          case "position": {
            if (nodeChange.dragging) {
              const parsedNodeChangeId = ZNodeId.safeParse(nodeChange.id);

              if (!parsedNodeChangeId.success || !nodeChange.position) return;

              treeClient.nodes.update.position(parsedNodeChangeId.data, nodeChange.position);
            }
            break;
          }
          case "select": {
            const parsedNodeChangeId = ZNodeId.safeParse(nodeChange.id);

            if (!parsedNodeChangeId.success) return;

            if (nodeChange.selected) {
              addSelectedNodes([parsedNodeChangeId.data]);
            } else {
              removeSelectedNode(nodeChange.id);
            }
            break;
          }
        }
      });
    },
    [
      addSelectedNodes,
      removeSelectedNode,
      removeSelectedNodes,
      setNodesToDelete,
      startNodeId,
      t,
      treeClient.nodes.update,
    ],
  );

  const onEdgeChange = React.useCallback(
    (edgeChanges: EdgeChange[]) => {
      edgeChanges.forEach((edgeChange) => {
        switch (edgeChange.type) {
          case "select":
            if (edgeChange.selected) {
              const parsedEdgeChangeId = ZEdgeId.safeParse(edgeChange.id);

              if (!parsedEdgeChangeId.success) return;

              addSelectedEdges([parsedEdgeChangeId.data]);
            } else {
              removeSelectedEdge(edgeChange.id);
            }
        }
      });
    },
    [addSelectedEdges, removeSelectedEdge],
  );

  const reactFlow = useReactFlow();

  const onNodeOptionSelect = React.useCallback(
    (plugin: NodePlugin<INode<string>>) => {
      const zoom = reactFlow.getZoom();

      if (!isDialogOpen) return;
      const node = plugin.create({
        position: reactFlow.screenToFlowPosition({
          x: isDialogOpen.canvasCoordinates.x - (nodeWidth / 2) * zoom,
          y: isDialogOpen.canvasCoordinates.y,
        }),
      })(treeClient);

      const connectingNodeId = editorStore.connectingNodeId;

      if (connectingNodeId) {
        const newEdge = ComplexLogicEdge.create({
          source: connectingNodeId,
          target: node.id,
        })(treeClient);

        if (newEdge instanceof Failure)
          return Notification.add({
            Title: t(`app.editor.errors.${newEdge.code}.short`),
            Content: t(`app.editor.errors.${newEdge.code}.long`),
            variant: "danger",
          });

        treeClient.nodes.add(node);
        treeClient.edges.add(newEdge);

        // replaceSelectedNodes([node.id]);
        // zoomToNode(node);
      }
    },
    [
      editorStore.connectingNodeId,
      isDialogOpen,
      reactFlow.screenToFlowPosition,
      reactFlow,
      t,
      treeClient,
    ],
  );

  return (
    <motion.div
      ref={reactFlowWrapperRef}
      className={
        className ? twMerge(containerClasses, className) : containerClasses
      }
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      key="editor"
    >
      <DropdownMenu.Root
        open={!!isDialogOpen}
        onOpenChange={() => setIsDialogOpen(undefined)}
      >
        <DropdownMenu.Trigger
          className="w-0 h-0 invisible absolute"
          style={{
            transform: isDialogOpen
              ? `translate(${isDialogOpen.pageCoordinates.x}px, ${isDialogOpen.pageCoordinates.y}px)`
              : "",
          }}
        >
          {t("app.editor.canvas.select-block-type")}
        </DropdownMenu.Trigger>
        <NodeDropdownContent onSelect={onNodeOptionSelect} />
      </DropdownMenu.Root>
      <NodeDeletionDialog />
      <ReactFlow
        disableKeyboardA11y={true}
        onPaneClick={closeNodeEditingSidebar}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        zoomOnDoubleClick={false}
        defaultViewport={defaultViewport}
        fitView={!defaultViewport}
        maxZoom={2}
        minZoom={0.1}
        snapToGrid
        snapGrid={[20, 20]}
        panOnScroll
        fitViewOptions={fitViewOptions}
        onConnectStart={onConnectStart}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        selectNodesOnDrag={false}
        onNodesChange={onNodeChange}
        onNodeDragStart={startDragging}
        onNodeDragStop={stopDragging}
        onEdgesChange={onEdgeChange}
        style={canvasStyle}
        nodeDragThreshold={10}
        connectionLineComponent={ConnectionLine}
        data-test="canvas"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          color="#d3d5d5"
          size={2}
        />
      </ReactFlow>
      <EditorToolbar className="absolute bottom-2.5 left-2.5" />
      {children}
    </motion.div>
  );
}
