import { FatalError } from "@mioto/errors";
import type { TranslationFn } from "@mioto/locale";
import { P, match } from "ts-pattern";
import type { TEdgeId, TNodeId } from "../../../../tree/id";
import {
  EdgePlugin,
  type IEdge,
  type createEdgeFn,
} from "../../../../tree/type/plugin/EdgePlugin";
import type { TNodePluginGroup } from "../../../../tree/type/plugin/NodePlugin";
import type { TTreeClient } from "../../../../tree/type/treeClient";
import {
  type IRecordVariable,
  RecordVariable,
} from "../../../../variables/exports/types";
import type { BooleanCondition } from "../conditions/Boolean";
import type { DateCondition } from "../conditions/Date";
import type { MultiSelectCondition } from "../conditions/MultiSelect";
import type { NumberCondition } from "../conditions/Number";
import type { PlaceholderCondition } from "../conditions/Placeholder";
import type { SelectCondition } from "../conditions/Select";
import type { TextCondition } from "../conditions/Text";
import type { Condition } from "../conditions/types";
import { convertVariableId } from "../migrations/convertVariableId";
import { convertVariableId2 } from "../migrations/convertVariableId2";

export const typeName = "complex-logic" as const;

export type Chain = "and" | "or" | "none";

export type Conditions =
  | SelectCondition
  | NumberCondition
  | PlaceholderCondition
  | BooleanCondition
  | MultiSelectCondition
  | TextCondition
  | DateCondition;

export interface IComplexLogicEdge extends IEdge<typeof typeName> {
  conditions: [Conditions, Chain][];
}

export class ComplexLogicEdgePlugin extends EdgePlugin<IComplexLogicEdge> {
  readonly hasResolver = true;
  private nodePlugins: TNodePluginGroup | undefined = undefined;

  constructor(config?: { t?: TranslationFn }) {
    super({
      type: typeName,
      // Because of a failed migration we need to skip a version and start with 2.
      pluginMigrations: [
        () => async () => undefined,
        () => async () => undefined,
        convertVariableId,
        convertVariableId2,
      ],
      ...config,
    });
  }

  transform =
    (
      edge: IEdge,
      {
        conditions,
        ...data
      }: Omit<
        IComplexLogicEdge,
        "source" | "target" | "type" | "version" | "id" | "pluginVersion"
      >,
    ) =>
    (treeClient: TTreeClient) => {
      return treeClient.edges.transform<IComplexLogicEdge>(edge, {
        ...data,
        type: this.type,
        version: this.version,
        pluginVersion: this.pluginVersion,
        conditions: conditions ?? [
          [{ id: crypto.randomUUID(), type: "placeholder" }, "none"],
        ],
      });
    };

  create: createEdgeFn<IComplexLogicEdge> =
    ({ conditions, ...data }, rules) =>
    (treeClient) => {
      return treeClient.edges.create<IComplexLogicEdge>(
        {
          type: this.type,
          conditions: conditions ?? [
            [{ id: crypto.randomUUID(), type: "placeholder" }, "none"],
          ],
          pluginVersion: this.pluginVersion,
          version: this.version,
          ...data,
        },
        rules,
      );
    };

  addCondition = (edgeId: TEdgeId) => (treeClient: TTreeClient) => {
    const edge = this.getSingle(edgeId)(treeClient);
    const previousCondition = edge.conditions[edge.conditions.length - 1];

    if (previousCondition) {
      previousCondition[1] = "and";
    }

    edge.conditions.push([
      { id: crypto.randomUUID(), type: "placeholder" },
      "none",
    ]);
  };

  updateChain =
    (edgeId: TEdgeId, conditionPosition: number, chain: "and" | "or") =>
    (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);
      const condition = edge.conditions[conditionPosition];

      if (condition) {
        condition[1] = chain;
      }
    };

  removeCondition =
    (edgeId: TEdgeId, conditionPosition: number) =>
    (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      if (edge.conditions.length >= 2 && conditionPosition > 0) {
        const condition = edge.conditions[conditionPosition - 1];

        if (!condition) {
          throw new Error("Condition not found");
        }

        edge.conditions[conditionPosition - 1] = [condition[0], "none"];
      }

      edge.conditions.splice(conditionPosition, 1);
    };

  resetCondition =
    (edgeId: TEdgeId, conditionPosition: number) =>
    (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      const condition = edge.conditions[conditionPosition];

      if (!condition) {
        throw new Error("Condition not found");
      }

      condition[0] = { type: "placeholder", id: condition[0].id };
    };

  setNodePlugins(nodePlugins: TNodePluginGroup) {
    this.nodePlugins = nodePlugins;
  }

  private getVariable(treeClient: TTreeClient, variableId: TNodeId) {
    const newVariableSourceNode = treeClient.nodes.get.single(variableId);

    if (!this.nodePlugins) {
      throw new FatalError({
        code: "node_plugins_not_initialized",
        debugMessage:
          "In order to use the complex logic plugins variable functionality a valid nodePluginObject needs to be provided by calling setNodePlugins.",
      });
    }

    return this.nodePlugins[newVariableSourceNode.type]?.createVariable({
      nodeId: newVariableSourceNode.id,
    })(treeClient).variable as IRecordVariable;
  }

  updateConditionVariablePath =
    (
      edgeId: TEdgeId,
      conditionPosition: number,
      variablePath: Condition["variablePath"],
    ) =>
    (treeClient: TTreeClient) => {
      const { recordId, id: childId } =
        RecordVariable.splitVariableId(variablePath);

      const recordVariable = this.getVariable(treeClient, recordId);
      const variable = childId
        ? RecordVariable.getValue(recordVariable, childId)
        : undefined;

      this.conditions.update(
        edgeId,
        conditionPosition,
        variable
          ? match(variable)
              .with(
                {
                  type: P.union(
                    "select",
                    "number",
                    "boolean",
                    "multi-select",
                    "text",
                    "date",
                  ),
                },
                (variable) =>
                  this.conditions[variable.type].create(variablePath),
              )

              .otherwise(() => {
                throw new FatalError({
                  code: "variable_type_not_supported",
                  additionalData: {
                    variable,
                  },
                });
              })
          : this.conditions.boolean.create(variablePath),
      )(treeClient);
    };

  getCondition =
    <TType extends Conditions["type"]>(
      edgeId: TEdgeId,
      position: number,
      type?: TType,
    ) =>
    (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      const condition = edge.conditions[position];

      if (!condition) {
        throw new Error("Condition not found");
      }

      if (type && condition[0].type !== type) {
        throw new FatalError({
          code: "wrong_condition_type",
          debugMessage: `You called the getCondition function for the ${type} condition type. However the found condition is of type ${condition[0].type}. Please review the calling code to resolve the mismatch.`,
        });
      }

      return condition[0] as Extract<Conditions, { type: TType }>;
    };

  get conditions() {
    return {
      update:
        (edgeId: TEdgeId, position: number, newCondition: Conditions) =>
        (treeClient: TTreeClient) => {
          const edge = this.getSingle(edgeId)(treeClient);
          const condition = edge.conditions[position];

          if (!condition) {
            throw new Error("Condition not found");
          }

          condition[0] = {
            ...newCondition,
            id: condition[0].id,
          };
        },
      date: {
        create: (variablePath: DateCondition["variablePath"]) => {
          return {
            id: crypto.randomUUID(),
            type: "date",
            variablePath,
            operator: "before",
          } satisfies DateCondition;
        },
        updateComparator:
          (edgeId: TEdgeId, position: number, comparator?: string) =>
          (treeClient: TTreeClient) => {
            const condition = this.getCondition(
              edgeId,
              position,
              "date",
            )(treeClient);

            if (!comparator) {
              condition.comparator = undefined;
            }

            condition.comparator = comparator;
          },
        updateOperator:
          (
            edgeId: TEdgeId,
            position: number,
            operator: DateCondition["operator"],
          ) =>
          (treeClient: TTreeClient) => {
            const condition = this.getCondition(
              edgeId,
              position,
              "date",
            )(treeClient);

            condition.operator = operator;
          },
      },
      number: {
        create: (variablePath: NumberCondition["variablePath"]) => {
          return {
            id: crypto.randomUUID(),
            type: "number",
            variablePath,
            operator: "=",
          } satisfies NumberCondition;
        },
        updateComparator:
          (edgeId: TEdgeId, position: number, comparator?: number) =>
          (treeClient: TTreeClient) => {
            const condition = this.getCondition(
              edgeId,
              position,
              "number",
            )(treeClient);

            if (!comparator) {
              condition.comparator = undefined;
            }

            condition.comparator = comparator;
          },
        updateOperator:
          (
            edgeId: TEdgeId,
            position: number,
            operator: NumberCondition["operator"],
          ) =>
          (treeClient: TTreeClient) => {
            const condition = this.getCondition(
              edgeId,
              position,
              "number",
            )(treeClient);

            condition.operator = operator;
          },
      },
      text: {
        create: (variablePath: TextCondition["variablePath"]) => {
          return {
            id: crypto.randomUUID(),
            type: "text",
            variablePath,
            operator: "contains",
          } satisfies TextCondition;
        },
        updateComparator:
          (edgeId: TEdgeId, position: number, comparator: string) =>
          (treeClient: TTreeClient) => {
            const edge = this.getSingle(edgeId)(treeClient);

            const condition = edge.conditions[position];

            if (!condition) {
              throw new Error("Condition not found");
            }

            if (condition[0].type !== "text") {
              throw new FatalError({
                code: "wrong_condition_type",
                debugMessage: `You called the updateComparator function for a number condition on a ${condition[0].type}. Please call the correct function.`,
              });
            }

            if (!comparator) {
              condition[0].comparator = undefined;
            }

            condition[0].comparator = comparator;
          },
        updateOperator:
          (
            edgeId: TEdgeId,
            position: number,
            operator: TextCondition["operator"],
          ) =>
          (treeClient: TTreeClient) => {
            const condition = this.getCondition(
              edgeId,
              position,
              "text",
            )(treeClient);

            condition.operator = operator;
          },
      },
      select: {
        create: (variablePath: SelectCondition["variablePath"]) => {
          return {
            id: crypto.randomUUID(),
            type: "select",
            variablePath,
            operator: "=",
            comparator: [],
          } satisfies SelectCondition;
        },
        updateComparator:
          (edgeId: TEdgeId, position: number, comparator: string[]) =>
          (treeClient: TTreeClient) => {
            const condition = this.getCondition(
              edgeId,
              position,
              "select",
            )(treeClient);

            condition.comparator = comparator;
          },
        updateOperator:
          (
            edgeId: TEdgeId,
            position: number,
            operator: SelectCondition["operator"],
          ) =>
          (treeClient: TTreeClient) => {
            const condition = this.getCondition(
              edgeId,
              position,
              "select",
            )(treeClient);

            condition.operator = operator;
          },
      },
      boolean: {
        create: (variablePath: BooleanCondition["variablePath"]) => {
          return {
            id: crypto.randomUUID(),
            type: "boolean",
            variablePath,
            operator: "true",
          } satisfies BooleanCondition;
        },
        updateOperator:
          (
            edgeId: TEdgeId,
            position: number,
            operator: BooleanCondition["operator"],
          ) =>
          (treeClient: TTreeClient) => {
            const condition = this.getCondition(
              edgeId,
              position,
              "boolean",
            )(treeClient);

            condition.operator = operator;
          },
      },
      "multi-select": {
        create: (variablePath: MultiSelectCondition["variablePath"]) => {
          return {
            id: crypto.randomUUID(),
            type: "multi-select",
            variablePath,
            operator: "=",
            comparator: [],
          } satisfies MultiSelectCondition;
        },
        updateComparator:
          (edgeId: TEdgeId, position: number, comparator: string[]) =>
          (treeClient: TTreeClient) => {
            const condition = this.getCondition(
              edgeId,
              position,
              "multi-select",
            )(treeClient);

            condition.comparator = comparator;
          },
        updateOperator:
          (
            edgeId: TEdgeId,
            position: number,
            operator: MultiSelectCondition["operator"],
          ) =>
          (treeClient: TTreeClient) => {
            const edge = this.getSingle(edgeId)(treeClient);

            const condition = edge.conditions[position];

            if (!condition) {
              throw new Error("Condition not found");
            }

            if (condition[0].type !== "multi-select") {
              throw new FatalError({
                code: "wrong_condition_type",
                debugMessage: `You called the updateOperator function for a select condition on a ${condition[0].type}. Please call the correct function.`,
              });
            }

            condition[0].operator = operator;
          },
      },
    };
  }
}

export const ComplexLogicEdge = new ComplexLogicEdgePlugin();
