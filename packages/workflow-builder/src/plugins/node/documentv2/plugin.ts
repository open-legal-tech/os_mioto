import type { TMainChildId, TNodeId } from "../../../tree/id";
import {
  type INode,
  NodePlugin,
  type createFn,
  type createVariableFn,
} from "../../../tree/type/plugin/NodePlugin";
import type {
  TReadOnlyTreeClient,
  TTreeClient,
} from "../../../tree/type/treeClient";
import {
  FileVariable,
  type IFileVariable,
  RecordVariable,
  type Variable,
} from "../../../variables/exports/types";

export type DocumentVariable = IFileVariable;

export const typeName = "documentv2" as const;

export interface IDocumentNodev2 extends INode<typeof typeName> {
  templateUuid?: string;
  documentName: string;
  outputAs?: "pdf" | "docx";
}

export class DocumentNodePluginV2 extends NodePlugin<IDocumentNodev2> {
  readonly hasAction = true;
  readonly hasRenderer = false;
  readonly hasWebhook = false;
  readonly hasSidebar = true;
  readonly hasCanvasNode = true;

  constructor() {
    super({ type: typeName, pluginMigrations: [], blockGroup: "action" });
  }

  override shouldIncludeInNavigation(
    _variables: Record<`node_${string}`, Variable>,
  ): boolean {
    return false;
  }

  create: createFn<IDocumentNodev2> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<IDocumentNodev2>({
      type: this.type,
      documentName: "Dokument",
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

      node.documentName = documentName;
    };

  updateOutputAs =
    (nodeId: TNodeId, outputAs: "pdf" | "docx") =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      node.outputAs = outputAs;
    };

  updateTemplateUuid =
    (nodeId: TNodeId, newTemplateUuid: string) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      node.templateUuid = newTemplateUuid;
    };

  deleteTemplateUuid = (nodeId: TNodeId) => (treeClient: TTreeClient) => {
    const node = this.getSingle(nodeId)(treeClient);

    delete node.templateUuid;
  };

  createVariable: createVariableFn<
    IFileVariable<TMainChildId>,
    IFileVariable["value"]
  > =
    ({ nodeId, execution = "unexecuted", value }) =>
    (treeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      return {
        variable: treeClient.nodes.create.variable(node, {
          execution,
          value: [
            FileVariable.create({
              fileType: node.outputAs ? [node.outputAs] : undefined,
              id: RecordVariable.createMainIdPath(node.id),
              name: node.documentName,
              value,
              status: node.isRemoved ? "missing" : "ok",
              execution,
            }),
          ],
        }),
      };
    };

  getDescription = (node: IDocumentNodev2) => () => {
    return `Block ${node.name} is of type ${node.type}. It generates a document called ${node.documentName}.`;
  };
}

export const DocumentNode = new DocumentNodePluginV2();
