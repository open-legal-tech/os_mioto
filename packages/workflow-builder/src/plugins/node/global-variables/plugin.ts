import { mapKeys, mapValues } from "remeda";
import { match } from "ts-pattern";
import type { z } from "zod";
import type { TChildId, TNodeId } from "../../../tree/id";
import { TreeEvent } from "../../../tree/type/TreeEventEmitter";
import {
  NodePlugin,
  type createFn,
  type createVariableFn,
  type isAddableFn,
  type onInterpreterInitFn,
} from "../../../tree/type/plugin/NodePlugin";
import type {
  TReadOnlyTreeClient,
  TTreeClient,
} from "../../../tree/type/treeClient";
import {
  DateVariable,
  type IRecordVariable,
  NumberVariable,
  type PrimitiveVariable,
  RecordVariable,
  TextVariable,
} from "../../../variables/exports/types";
import { addPosition } from "./migrations/addPosition";
import type {
  ZGlobalVariable,
  ZGlobalVariableId,
  ZGlobalVariablesNode,
} from "./type";

declare global {
  interface TreeEvents {
    onGlobalVariableAdd: { variableId: TGlobalVariableId };
    onGlobalVariableRemove: { variableId: TGlobalVariableId };
    onGlobalVariableTypeUpdate: {
      variableId: TGlobalVariableId;
      newType: GlobalVariable["type"];
    };
  }
}

export type TGlobalVariableId = z.infer<typeof ZGlobalVariableId>;

export type GlobalVariable = z.infer<typeof ZGlobalVariable>;

export const globalVariableType = "system-globalVariables" as const;

export type IGlobalVariablesNode = z.infer<
  ReturnType<typeof ZGlobalVariablesNode>
>;

export class GlobalVariablesNodePlugin extends NodePlugin<IGlobalVariablesNode> {
  readonly hasAction = false;
  readonly hasRenderer = false;
  readonly hasWebhook = false;
  readonly hasSidebar = false;
  readonly hasCanvasNode = false;
  override shouldIncludeInNavigation() {
    return false;
  }
  override includeInSearch = false;
  override isAddable: isAddableFn = () => {
    return false;
  };

  id = "node_globalVariables" as TNodeId;

  constructor() {
    super({
      type: globalVariableType,
      pluginMigrations: [addPosition],
      blockGroup: "system",
    });
  }

  create: createFn<IGlobalVariablesNode> = (data) => () => {
    return {
      variables: {},
      name: "Globale Variablen",
      type: this.type,
      pluginVersion: this.pluginVersion,
      id: this.id,
      version: 0,
      edges: [],
      position: { x: 0, y: 0 },
      final: false,
      ...data,
    } satisfies IGlobalVariablesNode;
  };

  createVariable: createVariableFn<
    PrimitiveVariable<TChildId>,
    Record<TGlobalVariableId, any>
  > =
    ({ execution: executionStatus = "unexecuted", value }) =>
    (treeClient) => {
      const node = this.has(this.id)(treeClient)
        ? this.getSingle(this.id)(treeClient)
        : undefined;

      const startDateVariableId = RecordVariable.createChildIdPath(
        this.id as any,
        "globalVar_startDate",
      );

      // TODO: Fix anys
      const globalRecordVariable = RecordVariable.create<
        PrimitiveVariable<TChildId>
      >({
        name: "Globale Variablen",
        id: this.id,
        execution: executionStatus,
        status: "ok",
        system: true,
        value: {
          [startDateVariableId]: DateVariable.create({
            id: startDateVariableId,
            name: "Ausführungsdatum",
            execution: executionStatus,
            value: new Date(),
          }),
          ...(node?.variables
            ? mapValues(
                mapKeys(node.variables, (key) => `${node.id}__${key}`) ?? {},
                (variable) => {
                  if (!variable) return;
                  return this.createChildVariable({
                    variable,
                    executionStatus,
                    value: value?.[variable.id] ?? variable.defaultValue,
                  });
                },
              )
            : {}),
        },
      });

      return { variable: globalRecordVariable };
    };

  private getAndCreateOnMissing(treeClient: TTreeClient) {
    const hasNode = this.has(this.id)(treeClient);

    if (!hasNode) {
      treeClient.nodes.add(this.create()(treeClient));
    }

    return this.getSingle(this.id)(treeClient);
  }

  createVariableUpdate = ({
    values,
    treeClient,
  }: {
    values: Record<string, any>;
    nodeId: TNodeId;
    treeClient: TTreeClient | TReadOnlyTreeClient;
  }): Record<string, PrimitiveVariable> => {
    const node = this.has(this.id)(treeClient)
      ? this.getSingle(this.id)(treeClient)
      : undefined;

    const result = {} as Record<string, PrimitiveVariable>;

    for (const key in values) {
      const value = values[key];
      const variableConfig = node?.variables[key];

      if (!variableConfig) continue;

      result[RecordVariable.createChildIdPath(this.id, key as any)] =
        this.createChildVariable({
          variable: variableConfig,
          value,
          executionStatus: "success",
        });
    }

    return result;
  };

  addVariable =
    (data: {
      name?: string;
      type: "text" | "number";
      references?: GlobalVariable["references"];
    }) =>
    (treeClient: TTreeClient) => {
      const node = this.getAndCreateOnMissing(treeClient);

      const id = `globalVar_${crypto.randomUUID()}` as const;

      node.variables[id] = {
        references: [],
        id,
        name: "",
        ...data,
      };
    };

  getVariable = (id: TGlobalVariableId) => (treeClient: TTreeClient) => {
    const node = this.getAndCreateOnMissing(treeClient);

    return node.variables[id];
  };

  updateVariableName =
    (id: TGlobalVariableId, name: string) => (treeClient: TTreeClient) => {
      const variable = this.getVariable(id)(treeClient);

      if (!variable) {
        throw new Error("Variable not found");
      }

      variable.name = name;
    };

  updateVariableType =
    (id: TGlobalVariableId, type: "text" | "number") =>
    (treeClient: TTreeClient) => {
      const variable = this.getVariable(id)(treeClient);

      if (!variable) {
        throw new Error("Variable not found");
      }

      variable.type = type;

      TreeEvent.emit("onGlobalVariableTypeUpdate", {
        variableId: id,
        newType: type,
      });
    };

  updateDefaultValue =
    (id: TGlobalVariableId, newDefaultValue: string) =>
    (treeClient: TTreeClient) => {
      const variable = this.getVariable(id)(treeClient);

      if (!variable) {
        throw new Error("Variable not found");
      }

      variable.defaultValue = newDefaultValue;
    };

  removeVariable = (id: TGlobalVariableId) => (treeClient: TTreeClient) => {
    if (!this.has(this.id)(treeClient)) return;

    const node = this.getSingle(this.id)(treeClient);

    delete node.variables[id];

    TreeEvent.emit("onGlobalVariableRemove", { variableId: id });
  };

  override onInterpreterInit: onInterpreterInitFn = (treeClient) => {
    return this.createVariable({
      nodeId: this.id,
      execution: "success",
      value: {
        globalVar_startDate: new Date(),
      },
    })(treeClient);
  };

  createChildVariable({
    variable,
    executionStatus,
    value,
  }: {
    variable?: IGlobalVariablesNode["variables"][string];
    executionStatus: IRecordVariable["execution"];
    value: any;
  }) {
    return match(variable)
      .with({ type: "number" }, (variable) =>
        NumberVariable.create({
          id: RecordVariable.createChildIdPath(this.id, variable.id),
          name: variable.name,
          execution: executionStatus,
          value,
        }),
      )
      .with({ type: "text" }, (variable) =>
        TextVariable.create({
          id: RecordVariable.createChildIdPath(this.id, variable.id),
          name: variable.name,
          execution: executionStatus,
          value,
        }),
      )
      .run();
  }
}

export const GlobalVariablesNode = new GlobalVariablesNodePlugin();
