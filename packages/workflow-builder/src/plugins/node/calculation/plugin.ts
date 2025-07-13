import { omit } from "remeda";
import type * as Y from "yjs";
import { createUnproxiedYRichTextFragment } from "../../../rich-text-editor/exports/RichNumber/transformers/yFragment";
import type { TMainChildId, TNodeId } from "../../../tree/id";
import {
  type INode,
  NodePlugin,
  type createFn,
  type createVariableFn,
} from "../../../tree/type/plugin/NodePlugin";
import type { TTreeClient } from "../../../tree/type/treeClient";
import {
  DateVariable,
  type IDateVariable,
  type INumberVariable,
  NumberVariable,
  RecordVariable,
  type Variable,
} from "../../../variables/exports/types";
import {
  GlobalVariablesNode,
  type TGlobalVariableId,
} from "../global-variables/plugin";
import { addCalculationType } from "./migrations/addCalculationType";
import { renameYContentToYFormular } from "./migrations/renameYContentToYFormular";

export const calculationNodeType = "calculation" as const;

interface BaseCalculationNode extends INode<typeof calculationNodeType> {
  globalVariableReference?: TGlobalVariableId;
}

export type ICalculationNode = BaseCalculationNode &
  (
    | {
        calculationType: "date-difference";
        yLaterDateFormular: Y.XmlFragment;
        yEarlierDateFormular: Y.XmlFragment;
        differenceIn: "days" | "business-days" | "weeks" | "months" | "years";
      }
    | {
        roundTo?: number;
        yFormular: Y.XmlFragment;
        calculationType: "number";
      }
    | {
        calculationType: "date";
        yDateFormular: Y.XmlFragment;
      }
  );

export type INumberCalculationNode = Extract<
  ICalculationNode,
  { calculationType: "number" }
>;
export type IDateCalculationNode = Extract<
  ICalculationNode,
  { calculationType: "date" }
>;
export type IDateDifferenceNode = Extract<
  ICalculationNode,
  { calculationType: "date-difference" }
>;

export class CalculationNodePlugin extends NodePlugin<ICalculationNode> {
  readonly hasAction = true;
  readonly hasRenderer = false;
  readonly hasWebhook = false;
  readonly hasSidebar = true;
  readonly hasCanvasNode = true;
  override shouldIncludeInNavigation(
    _variables: Record<`node_${string}`, Variable>,
  ): boolean {
    return false;
  }

  constructor() {
    super({
      type: calculationNodeType,
      pluginMigrations: [renameYContentToYFormular, addCalculationType],
      blockGroup: "data",
    });
  }

  create: createFn<ICalculationNode> = (data) => (treeClient) => {
    switch (data?.calculationType) {
      case "date":
        return this.createDateCalculationNode(data as any)(treeClient);

      case "date-difference":
        return this.createDateDifferenceNode(data as any)(treeClient);
      default:
        return this.createNumberCalculationNode(data as any)(treeClient);
    }
  };

  createNumberCalculationNode: createFn<INumberCalculationNode> =
    (data) => (treeClient) => {
      return treeClient.nodes.create.node<INumberCalculationNode>({
        type: this.type,
        version: this.version,
        pluginVersion: this.pluginVersion,
        calculationType: "number",
        yFormular: createUnproxiedYRichTextFragment(data?.content),
        ...omit(data ?? {}, ["calculationType"]),
      });
    };

  createDateCalculationNode: createFn<IDateCalculationNode> =
    (data) => (treeClient) => {
      return treeClient.nodes.create.node<IDateCalculationNode>({
        type: this.type,
        version: this.version,
        pluginVersion: this.pluginVersion,
        calculationType: "date",
        yDateFormular: createUnproxiedYRichTextFragment(data?.content),
        ...omit(data ?? {}, ["calculationType"]),
      });
    };

  createDateDifferenceNode: createFn<IDateDifferenceNode> =
    (data) => (treeClient) => {
      return treeClient.nodes.create.node<IDateDifferenceNode>({
        type: this.type,
        version: this.version,
        pluginVersion: this.pluginVersion,
        calculationType: "date-difference",
        yEarlierDateFormular: createUnproxiedYRichTextFragment(),
        yLaterDateFormular: createUnproxiedYRichTextFragment(data?.content),
        differenceIn: "days",
        ...omit(data ?? {}, ["calculationType"]),
      });
    };

  createVariable: createVariableFn<
    INumberVariable<TMainChildId> | IDateVariable<TMainChildId>,
    number | Date
  > =
    ({ nodeId, execution = "unexecuted", value }) =>
    (treeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      const globalVariable = node.globalVariableReference
        ? GlobalVariablesNode.createVariableUpdate({
            nodeId,
            treeClient,
            values: {
              [node.globalVariableReference]: value,
            },
          })
        : undefined;

      let childVariable:
        | IDateVariable<TMainChildId>
        | INumberVariable<TMainChildId>;

      switch (node.calculationType) {
        case "date": {
          const isCorrectValue = (value: any): value is Date | undefined =>
            !value || value instanceof Date;

          if (!isCorrectValue(value)) {
            throw new Error("Value must be a date or undefined");
          }

          childVariable = DateVariable.create({
            execution,
            id: RecordVariable.createMainIdPath(nodeId),
            name: "Datumsberechnung",
            value,
            readableValue: value?.toLocaleDateString(),
            main: true,
          });
          break;
        }

        case "number":
        case "date-difference": {
          childVariable = NumberVariable.create({
            execution,
            id: RecordVariable.createMainIdPath(nodeId),
            name: "Berechnung",
            value: value?.toString(),
            main: true,
          });
          break;
        }

        default:
          throw new Error("Unknown calculation type");
      }

      return {
        globalVariable,
        variable: RecordVariable.create({
          id: nodeId,
          name: node.name,
          status: "ok",
          execution,
          value: { [childVariable.id]: childVariable },
        }),
      };
    };

  updateRound =
    (nodeId: TNodeId, roundTo: number) => (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node.calculationType !== "number") {
        throw new Error("Rounding is only available for number calculations");
      }

      node.roundTo = roundTo;
    };

  disableRound = (nodeId: TNodeId) => (treeClient: TTreeClient) => {
    const node = this.getSingle(nodeId)(treeClient);

    if (node.calculationType !== "number") {
      throw new Error("Rounding is only available for number calculations");
    }

    node.roundTo = undefined;
  };

  updateGlobalVariableReference =
    (nodeId: TNodeId, globalVariableReference: TGlobalVariableId) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);
      node.globalVariableReference = globalVariableReference;
    };

  updateCalculationType =
    (nodeId: TNodeId, type: "number" | "date" | "date-difference") =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      treeClient.nodes.replace(
        nodeId,
        this.create({ ...node, calculationType: type })(treeClient),
      );
    };

  updateDifferenceIn =
    (nodeId: TNodeId, differenceIn: "days" | "months" | "years") =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (node.calculationType !== "date-difference") {
        throw new Error(
          "DifferenceIn is only available for date difference calculations",
        );
      }

      node.differenceIn = differenceIn;
    };
}
export const CalculationNode = new CalculationNodePlugin();
