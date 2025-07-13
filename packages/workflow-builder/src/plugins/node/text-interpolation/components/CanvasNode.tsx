"use client";

import { CanvasNodeContainer } from "../../../../editor/components/CanvasNode";
import type { TCanvasNode } from "../../../../editor/editorTreeClient";
import { useTree } from "../../../../tree/sync/state";
import { TextInterpolationNode } from "../plugin";

export const TextInterpolationCanvasNode: TCanvasNode = ({ id, ...props }) => {
  const node = useTree((treeClient) => {
    if (TextInterpolationNode.has(id)(treeClient)) {
      return TextInterpolationNode.getSingle(id)(treeClient);
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
