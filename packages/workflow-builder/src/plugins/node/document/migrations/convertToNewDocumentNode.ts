import type { pluginMigrationFn } from "../../../../tree/type/migrations/createPluginMigration";
import { DocumentNode } from "../../documentv2/plugin";
import type { IDocumentNode } from "../plugin";

export const convertToNewDocumentNode: pluginMigrationFn<IDocumentNode> =
  (treeClient) => async (node) => {
    console.log(`Migrate document node ${node.id} to document node v2`);
    const documentNode = DocumentNode.create({
      documentName: node.documentName ?? "",
      edges: node.edges,
      fallbackEdge: node.fallbackEdge,
      final: node.final,
      isRemoved: node.isRemoved,
      name: node.name,
      parent: node.parent,
      position: node.position,
      templateUuid: node.templateUuid,
    })(treeClient);

    treeClient.nodes.replace(node.id, documentNode);
  };
