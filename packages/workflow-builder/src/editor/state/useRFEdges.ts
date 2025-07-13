import { MarkerType } from "@xyflow/react";
import type { TEdgeId } from "../../tree/id";
import { useTree } from "../../tree/sync/state";
import type { TTreeClient } from "../../tree/type/treeClient";
import { useSelectedEdgeIds } from "../useSelectedEdges";

export function useRFEdges() {
  const edges = useTree((treeClient) => treeClient.edges.get.all());

  const selectedEdgeIds = useSelectedEdgeIds();
  if (!edges) return [];

  return Object.values(edges)
    .map((edge) => ({
      ...edge,
      selected: selectedEdgeIds.includes(edge.id),
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#7e868c",
      },
      data: {},
    }))
    .filter((edge) => edge.target) as {
    type?: any;
    data?: Record<string, any>;
    target: string;
    id: string;
    source: string;
  }[];
}

export function createRFEdges({
  treeClient,
  selectedEdgeIds,
}: {
  treeClient: TTreeClient;
  selectedEdgeIds: TEdgeId[];
}) {
  const edges = treeClient.edges.get.all();

  return Object.values(edges)
    .map((edge) => ({
      ...edge,
      selected: selectedEdgeIds.includes(edge.id),
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#7e868c",
      },
    }))
    .filter((edge) => edge.target) as {
    type?: any;
    data?: unknown;
    target: string;
    id: string;
    source: string;
  }[];
}
