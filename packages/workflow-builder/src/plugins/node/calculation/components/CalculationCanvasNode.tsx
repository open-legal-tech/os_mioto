"use client";

import { CanvasNodeContainer } from "../../../../editor/components/CanvasNode";
import type { TCanvasNode } from "../../../../editor/editorTreeClient";
import { useTree } from "../../../../tree/sync/state";
import { CalculationNode } from "../plugin";

export const CalculationCanvasNode: TCanvasNode = ({ id, ...props }) => {
  const node = useTree((treeClient) => {
    if (CalculationNode.has(id)(treeClient)) {
      return CalculationNode.getSingle(id)(treeClient);
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
