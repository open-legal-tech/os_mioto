import { keys } from "remeda";
import { Map as YMap } from "yjs";
import { z } from "zod";
import { DocumentNode } from "../../plugins/node/document/plugin";
import { DocumentNode as DocumentNodeV2 } from "../../plugins/node/documentv2/plugin";
import type { TTree } from "../../tree/exports/types";
import type { TNodeId } from "../../tree/id";
import { TreeClient } from "../../tree/type/treeClient";

export const convertTreeToExport = (tree: TTree, treeMap: YMap<any>) => {
  const treeClient = new TreeClient(tree, treeMap);

  const documentNodesV2 = DocumentNodeV2.getAll(treeClient);
  const documentNodes = DocumentNode.getAll(treeClient);

  keys(documentNodesV2).forEach((key) => {
    DocumentNodeV2.deleteTemplateUuid(key)(treeClient);
  });

  keys(documentNodes).forEach((key) => {
    DocumentNode.deleteTemplateUuid(key)(treeClient);
  });
};

export const convertTreeToReadableExport = (tree: TTree) => {
  const treeClient = new TreeClient(tree, new YMap());

  const removedNodes = Object.keys(
    treeClient.nodes.get.removedNodes(),
  ) as TNodeId[];

  treeClient.nodes.delete(removedNodes);

  return tree;
};

export const ZTreeImport = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  treeDocument: z
    .object({
      type: z.literal("Buffer"),
      data: z.array(z.number()),
    })
    .optional(),
  treeData: z.any(),
});

export const ZTreeExport = ZTreeImport.extend({
  treeDocument: z.instanceof(Uint8Array),
  treeData: z.any(),
});
