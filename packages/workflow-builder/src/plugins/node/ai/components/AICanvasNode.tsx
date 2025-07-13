"use client";

import { CanvasNodeContainer } from "../../../../editor/components/CanvasNode";
import type { TCanvasNode } from "../../../../editor/editorTreeClient";
import { useTree } from "../../../../tree/sync/state";
import { AINode } from "../exports/plugin";

export const AICanvasNode: TCanvasNode = ({ id, ...props }) => {
  const node = useTree((treeClient) => {
    if (AINode.has(id)(treeClient)) {
      return AINode.getSingle(id)(treeClient);
    }

    return null;
  });

  if (!node) return null;

  return (
    <CanvasNodeContainer id={id} {...props}>
      {node.name}
    </CanvasNodeContainer>
  );
};
