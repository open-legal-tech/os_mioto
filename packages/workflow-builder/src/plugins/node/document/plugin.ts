import type { TRichText } from "../../../rich-text-editor/exports/types";
import type { TMainChildId, TNodeId } from "../../../tree/id";
import {
  type INode,
  NodePlugin,
  type createFn,
  type createVariableFn,
  type isAddableFn,
} from "../../../tree/type/plugin/NodePlugin";
import type {
  TReadOnlyTreeClient,
  TTreeClient,
} from "../../../tree/type/treeClient";
import {
  FileVariable,
  type IFileVariable,
  RecordVariable,
} from "../../../variables/exports/types";
import { convertToNewDocumentNode } from "./migrations/convertToNewDocumentNode";

export const typeName = "document" as const;

export interface IDocumentNode extends INode<typeof typeName> {
  content?: TRichText;
  templateUuid?: string;
  documentName: string;
  downloadButtonLabel?: string;
}

export class DocumentNodePlugin extends NodePlugin<IDocumentNode> {
  readonly hasAction = false;
  readonly hasWebhook = false;
  readonly hasRenderer = false;
  readonly hasSidebar = false;
  readonly hasCanvasNode = false;
  override isAddable: isAddableFn = () => false;

  constructor() {
    super({
      type: typeName,
      pluginMigrations: [convertToNewDocumentNode],
      blockGroup: "action",
    });
  }

  create: createFn<IDocumentNode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<IDocumentNode>({
      type: this.type,
      documentName: "Dokument",
      edges: [],
      version: this.version,
      pluginVersion: this.pluginVersion,
      ...data,
    });
  };

  getByTemplateUuid =
    (templateUuid: string) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const nodes = this.getAll(treeClient);

      return Object.values(nodes ?? {}).filter(
        (node) => node.templateUuid === templateUuid,
      );
    };

  updateDocumentName =
    (nodeId: TNodeId, documentName: string) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      node.documentName = documentName;
    };

  updateDownloadButtonLabel =
    (nodeId: TNodeId, downloadButtonLabel: string) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      node.downloadButtonLabel = downloadButtonLabel;
    };

  updateNodeContent =
    (nodeId: TNodeId, content: IDocumentNode["content"]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node) return;

      node.content = content;
    };

  updateTemplateUuid =
    (nodeId: TNodeId, newTemplateUuid: string) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      node.templateUuid = newTemplateUuid;
    };

  deleteTemplateUuid = (nodeId: TNodeId) => (treeClient: TTreeClient) => {
    const node = this.getSingle(nodeId)(treeClient);

    if (!node) return;

    node.templateUuid = undefined;
  };

  createVariable: createVariableFn<IFileVariable<TMainChildId>> =
    ({ nodeId, execution = "unexecuted", value }) =>
    (treeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      return {
        variable: RecordVariable.create({
          id: nodeId,
          execution,
          name: node.name,
          status: node.isRemoved ? "missing" : "ok",
          value: [
            FileVariable.create({
              id: RecordVariable.createMainIdPath(nodeId),
              name: node.name,
              value,
              status: node.isRemoved ? "missing" : "ok",
              execution,
            }),
          ],
        }),
      };
    };
}

export const DocumentNode = new DocumentNodePlugin();
