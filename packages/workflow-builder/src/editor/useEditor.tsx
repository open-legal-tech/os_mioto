import { FatalError } from "@mioto/errors";
import { useReactFlow, useStore } from "@xyflow/react";
import * as React from "react";
import useUnmount from "react-use/esm/useUnmount";
import { proxy, useSnapshot } from "valtio";
import type { TEdgeId, TNodeId } from "../tree/id";
import { useTreeClient } from "../tree/sync/state";
import type { INode } from "../tree/type/plugin/NodePlugin";
import type { TTreeClient } from "../tree/type/treeClient";
import type { TCoordinates } from "../tree/type/type-classes/Node";
import { calculateCenterOfNode } from "./utils/calculateCenterOfNode";
import { sidebarWidth } from "./utils/constants";

type EditorStore = {
  connectingNodeId: TNodeId | null;
  validConnections: TNodeId[];
  selectedNodeIds: TNodeId[];
  selectedEdgeIds: TEdgeId[];
  nodesToDelete: TNodeId[];
  isDragging: boolean;
};

const createSelectionMethods = (
  treeClient: TTreeClient,
  editorStore: EditorStore,
) => {
  function startConnecting(sourceNodeId: TNodeId) {
    const connectionOriginNode = treeClient.nodes.get.single(sourceNodeId);
    if (!connectionOriginNode) return;

    editorStore.connectingNodeId = sourceNodeId;

    const validConnections = treeClient.nodes.get.connectableNodes(
      connectionOriginNode.id,
    );

    editorStore.validConnections = validConnections;
  }

  function abortConnecting() {
    editorStore.connectingNodeId = null;
    editorStore.validConnections = [];
  }

  function addSelectedNodes(nodeIds: TNodeId[]) {
    editorStore.selectedNodeIds.push(...nodeIds);
  }

  function replaceSelectedNodes(nodeIds: TNodeId[]) {
    editorStore.selectedNodeIds = nodeIds;
  }

  function removeSelectedNodes() {
    editorStore.selectedNodeIds = [];
  }

  function removeSelectedNode(nodeId: string) {
    const nodeIndex = editorStore.selectedNodeIds.findIndex(
      (id) => id === nodeId,
    );
    editorStore.selectedNodeIds.splice(nodeIndex, 1);
  }

  function addSelectedEdges(edgeIds: TEdgeId[]) {
    editorStore.selectedEdgeIds.push(...edgeIds);
  }

  function replaceSelectedEdges(edgeIds: TEdgeId[]) {
    editorStore.selectedEdgeIds = edgeIds;
  }

  function removeSelectedEdges() {
    editorStore.selectedEdgeIds = [];
  }

  function removeSelectedEdge(edgeId: string) {
    const edgeIndex = editorStore.selectedEdgeIds.findIndex(
      (id) => id === edgeId,
    );
    editorStore.selectedEdgeIds.splice(edgeIndex, 1);
  }

  return {
    abortConnecting,
    startConnecting,
    addSelectedNodes,
    replaceSelectedEdges,
    replaceSelectedNodes,
    removeSelectedEdge,
    removeSelectedEdges,
    removeSelectedNode,
    removeSelectedNodes,
    addSelectedEdges,
  };
};

type EditorState = {
  getCenter: () => TCoordinates | undefined;
  reactFlowWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
  closeNodeEditingSidebar: () => void;
  zoomToNode: (node: INode) => void;
  isConnecting: boolean;
  setNodesToDelete: (nodeIds: TNodeId[]) => void;
  removeNodesToDelete: () => void;
  editorStore: EditorStore;
  startDragging: () => void;
  stopDragging: () => void;
  multiSelectionActive: boolean;
};

export const EditorContext = React.createContext<
  (EditorState & ReturnType<typeof createSelectionMethods>) | null
>(null);

type TreeProviderProps = Omit<
  React.ComponentProps<typeof EditorContext.Provider>,
  "value"
>;

const editorStore = proxy<EditorStore>({
  connectingNodeId: null,
  validConnections: [],
  selectedNodeIds: [],
  selectedEdgeIds: [],
  nodesToDelete: [],
  isDragging: false,
});

export function EditorProvider({ children }: TreeProviderProps) {
  const reactFlowWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const reactFlowBounds = reactFlowWrapperRef.current?.getBoundingClientRect();
  const isConnecting = useStore((state) => state.connection.from != null);

  const userSelectionActive = useStore((state) => state.userSelectionActive);
  const multiSelectionActive = useStore((state) => !!state.userSelectionRect);

  const { screenToFlowPosition, setCenter, getZoom } = useReactFlow();

  const getCenter = () => {
    if (!reactFlowBounds) return undefined;

    return screenToFlowPosition({
      x: reactFlowBounds.width / 2,
      y: reactFlowBounds.height / 2,
    });
  };

  function zoomToNode(node: INode) {
    if (userSelectionActive || multiSelectionActive) return;
    const positionOfNodeFromCenter = calculateCenterOfNode(
      node.position,
      node.id ? { x: sidebarWidth / 2, y: 0 } : undefined,
    );

    setCenter?.(positionOfNodeFromCenter.x, positionOfNodeFromCenter.y, {
      zoom: getZoom(),
      duration: 1000,
    });
  }

  const { treeClient } = useTreeClient();

  const selectionFunctions = React.useMemo(() => {
    return createSelectionMethods(treeClient, editorStore);
  }, [treeClient]);

  function setNodesToDelete(nodeIds: TNodeId[]) {
    editorStore.nodesToDelete = nodeIds;
  }

  function removeNodesToDelete() {
    editorStore.nodesToDelete = [];
  }

  useUnmount(() => {
    editorStore.connectingNodeId = null;
    editorStore.selectedEdgeIds = [];
    editorStore.selectedNodeIds = [];
    editorStore.validConnections = [];
  });

  return (
    <EditorContext.Provider
      value={{
        getCenter,
        reactFlowWrapperRef,
        closeNodeEditingSidebar: () => selectionFunctions.removeSelectedNodes(),
        zoomToNode,
        ...selectionFunctions,
        editorStore,
        isConnecting,
        setNodesToDelete,
        removeNodesToDelete,
        startDragging: () => {
          editorStore.isDragging = true;
        },
        stopDragging: () => {
          editorStore.isDragging = false;
        },
        multiSelectionActive,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const editorContext = React.useContext(EditorContext);

  if (!editorContext) {
    throw new FatalError({ code: "missing_context_provider" });
  }

  return editorContext;
}

export function useEditorState() {
  return useSnapshot(editorStore);
}

export { ReactFlowProvider } from "@xyflow/react";
