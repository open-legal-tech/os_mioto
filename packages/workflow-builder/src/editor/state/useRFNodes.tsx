import { useTree } from "../../tree/sync/state";
import { useSelectedNodeIds } from "../useSelectedNodes";

export function useRFNodes() {
  const selectedNodeIds = useSelectedNodeIds();
  return useTree((treeClient) => {
    const nodes = treeClient.nodes.get.all();

    return Object.values(nodes).map(({ id, position, type, parent }) => {
      return {
        type,
        selected: selectedNodeIds.includes(id),
        id,
        position: position ?? { x: 0, y: 0 },
        expandParent: true,
        data: {},
        className: "focus-visible:outer-focus",
        ...(parent ? ({ parentId: parent } as const) : undefined),
      };
    });
  });
}

export type NodePluginProps = ReturnType<typeof useRFNodes>[number];
