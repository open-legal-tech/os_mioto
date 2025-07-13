import { useTree } from "../tree/sync/state";
import { useEditorState } from "./useEditor";

export function useSelectedNodes() {
  const selectedNodeIds = useSelectedNodeIds();

  const nodes = useTree((treeClient) =>
    treeClient.nodes.get.collection(selectedNodeIds),
  );

  if (!nodes) return undefined;

  return nodes;
}

export function useSelectedNodeIds() {
  const { selectedNodeIds } = useEditorState();

  return selectedNodeIds;
}
