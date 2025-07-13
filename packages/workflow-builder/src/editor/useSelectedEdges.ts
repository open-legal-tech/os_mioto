import { useTree } from "../tree/sync/state";
import { useEditorState } from "./useEditor";

export function useSelectedEdges() {
  const selectedEdgeIds = useSelectedEdgeIds();
  const edges = useTree((treeClient) =>
    treeClient.edges.get.collection(selectedEdgeIds),
  );

  if (!edges) return undefined;

  return Object.values(edges);
}

export function useSelectedEdgeIds() {
  const { selectedEdgeIds } = useEditorState();

  return selectedEdgeIds;
}
