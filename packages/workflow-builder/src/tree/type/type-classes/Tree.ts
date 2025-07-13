import { z } from "zod";
import { type TEdgeId, type TNodeId, ZEdgeId, ZNodeId } from "../../id";
import type { IEdge } from "../plugin/EdgePlugin";
import type { INode } from "../plugin/NodePlugin";
import { Theme } from "./Theme";

export const TreeType = z.object({
  startNode: ZNodeId.optional(),
  nodes: z.custom<Record<TNodeId, INode>>((value) => {
    if (!value || typeof value !== "object") return false;

    for (const key in value) {
      if (!ZNodeId.safeParse(key).success) return false;
    }

    return true;
  }),
  edges: z.custom<Record<TEdgeId, IEdge>>((value) => {
    if (!value || typeof value !== "object") return false;

    for (const key in value) {
      if (!ZEdgeId.safeParse(key).success) return false;
    }

    return true;
  }),
  theme: Theme.optional(),
});

export type TTree = z.infer<typeof TreeType>;

export type TTheme = z.infer<typeof Theme>;
