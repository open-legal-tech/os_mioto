import { Failure } from "@mioto/errors";
import { omit } from "remeda";
import { isDefined } from "remeda";
import type { z } from "zod";
import {
  createUnproxiedYRichTextFragment,
} from "../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type { TChildId, TMainChildId, TNodeId } from "../../../tree/id";
import {
  NodePlugin,
  type createFn,
  type createVariableFn,
} from "../../../tree/type/plugin/NodePlugin";
import type {
  TReadOnlyTreeClient,
  TTreeClient,
} from "../../../tree/type/treeClient";
import {
  type ISelectVariable,
  RecordVariable,
  SelectVariable,
  type Variable,
} from "../../../variables/exports/types";
import { convertContentToYContent } from "../shared/convertContentToYContent";
import { addReportingTypes } from "./migrations/addReportingTypes";
import { addSendToAccount } from "./migrations/addSendToAccount";
import { addYSubject } from "./migrations/addYSubject";
import { migrateAttachementVariable } from "./migrations/migrateAttachementVariable";
import type { ZReportingNode } from "./type";

export const typeName = "reporting" as const;

export type IReportingNode = z.infer<ReturnType<typeof ZReportingNode>>;

export class ReportingNodePlugin extends NodePlugin<IReportingNode> {
  readonly hasAction = true;
  readonly hasRenderer = false;
  readonly hasWebhook = false;
  readonly hasSidebar = true;
  readonly hasCanvasNode = true;
  constructor() {
    super({
      type: typeName,
      pluginMigrations: [
        convertContentToYContent("mailBody", "yMailBody"),
        addYSubject,
        migrateAttachementVariable,
        addSendToAccount,
        addReportingTypes,
      ],
      blockGroup: "action",
    });
  }

  override shouldIncludeInNavigation(
    _variables: Record<`node_${string}`, Variable>,
  ): boolean {
    return false;
  }

  create: createFn<IReportingNode> = (data) => (treeClient) => {
    switch (data?.receivingEmailType) {
      case "variable":
        return this.createVariableEmailNode(data)(treeClient);
      case "custom":
        return this.createCustomEmailNode(data)(treeClient);
      default:
        return this.createDefaultEmailNode(data)(treeClient);
    }
  };

  createDefaultEmailNode: createFn<IReportingNode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<IReportingNode>({
      ...data,
      type: this.type,
      mailSubject: "Neuer Betreff",
      attachements: [],
      sendUserAnswers: false,
      version: this.version,
      pluginVersion: this.pluginVersion,
      yMailBody: createUnproxiedYRichTextFragment(),
      ySubject: createUnproxiedYRichTextFragment(),
      variant: {
        type: "default",
      },
    });
  };

  createVariableEmailNode: createFn<IReportingNode> =
    (data) => (treeClient) => {
      return treeClient.nodes.create.node<IReportingNode>({
        ...data,
        type: this.type,
        mailSubject: "Neuer Betreff",
        attachements: [],
        sendUserAnswers: false,
        version: this.version,
        pluginVersion: this.pluginVersion,
        yMailBody: createUnproxiedYRichTextFragment(),
        ySubject: createUnproxiedYRichTextFragment(),
        variant: {
          type: "variable",
        },
      });
    };

  createCustomEmailNode: createFn<IReportingNode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<IReportingNode>({
      ...data,
      type: this.type,
      mailSubject: "Neuer Betreff",
      attachements: [],
      sendUserAnswers: false,
      version: this.version,
      pluginVersion: this.pluginVersion,
      yMailBody: createUnproxiedYRichTextFragment(),
      ySubject: createUnproxiedYRichTextFragment(),
      variant: {
        type: "custom",
      },
    });
  };

  updateRecipient =
    (nodeId: TNodeId, recipient?: string) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);
      if (node.variant.type !== "custom") {
        throw new Error(
          "Recipient can only be set for custom email type. Use updateVariableRecipient instead",
        );
      }

      if (!node) return;

      node.variant.recipientCustom = recipient;
    };

  updateVariableRecipient =
    (nodeId: TNodeId, recipient?: TMainChildId | TChildId) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);
      if (node.variant.type !== "variable") {
        throw new Error(
          "Recipient can only be set for variable email type. Use updateRecipient instead",
        );
      }

      if (!node) return;

      if (!recipient) {
        node.variant.recipientVariable = undefined;
        return;
      }

      node.variant.recipientVariable = recipient;
    };

  updateSendUserAnswers =
    (nodeId: TNodeId, sendUserAnswers: boolean) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      node.sendUserAnswers = sendUserAnswers;
    };

  updateAttachements =
    (nodeId: TNodeId, attachements: (TMainChildId | TChildId)[] = []) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      node.attachements = attachements;
    };

  removeAttachement =
    (nodeId: TNodeId, attachementNodeId: TNodeId) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      const attachementIndex = node.attachements.findIndex(
        (id) => id === attachementNodeId,
      );
      node.attachements.splice(attachementIndex, 1);
    };

  getErrors =
    (nodeId: TNodeId) => (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      return Object.values(node.attachements)
        .map((attachement) => {
          const attachementSourceNode =
            treeClient.nodes.get.single(attachement);

          if (attachementSourceNode.isRemoved) {
            return new Failure({
              code: "attachement_source_removed",
              additionalData: {
                attachementSourceNodeId: attachementSourceNode.id,
              },
            });
          }

          return undefined;
        })
        .filter(isDefined);
    };

  createVariable: createVariableFn<ISelectVariable<TMainChildId>> =
    ({ nodeId, execution = "unexecuted", value }) =>
    (treeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      return {
        variable: treeClient.nodes.create.variable(node, {
          execution,
          value: [
            SelectVariable.create({
              execution,
              id: RecordVariable.createMainIdPath(nodeId),
              name: "E-Mail versandt",
              value,
              values: [{ id: "Erfolg" }, { id: "Fehler" }],
            }),
          ],
        }),
      };
    };

  updateEmailType =
    (nodeId: TNodeId, type: "default" | "variable" | "custom") =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      treeClient.nodes.replace(
        nodeId,
        this.create({ ...node, receivingEmailType: type })(treeClient),
      );
    };
}

export const ReportingNode = new ReportingNodePlugin();
