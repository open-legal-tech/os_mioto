"use client";

import { CanvasNodeContainer } from "../../../../editor/components/CanvasNode";
import type { TCanvasNode } from "../../../../editor/editorTreeClient";
import { useTree } from "../../../../tree/sync/state";
import { DocumentNode } from "../plugin";

export const DocumentCanvasNode: TCanvasNode = ({ id, ...props }) => {
  const node = useTree((treeClient) => {
    if (DocumentNode.has(id)(treeClient)) {
      return DocumentNode.getSingle(id)(treeClient);
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
