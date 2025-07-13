"use client";

import { CanvasNodeContainer } from "../../../../editor/components/CanvasNode";
import type { TCanvasNode } from "../../../../editor/editorTreeClient";
import { useTree } from "../../../../tree/sync/state";
import { ReportingNodePlugin } from "../plugin";

const ReportingNode = new ReportingNodePlugin();

export const ReportingCanvasNode: TCanvasNode = ({ id, ...props }) => {
  const node = useTree((treeClient) => {
    if (ReportingNode.has(id)(treeClient)) {
      return ReportingNode.getSingle(id)(treeClient);
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
