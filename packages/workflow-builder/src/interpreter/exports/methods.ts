import { pickBy } from "remeda";
import type { TNodeId } from "../../tree/id";
import type { INode } from "../../tree/type/plugin/NodePlugin";
import type { TTreeClient } from "../../tree/type/treeClient";
import type {
  IFileVariable,
  IRichTextVariable,
  PrimitiveVariable,
  TModuleVariableValue,
} from "../../variables/exports/types";
import {
  type Filters,
  filterVariables,
} from "../../variables/utils/filterVariables";
import type { Context } from "./interpreter";

export const getVariables =
  (context: TModuleVariableValue) =>
  <TPrimitives extends PrimitiveVariable | IFileVariable | IRichTextVariable>(
    filters?: Filters<TPrimitives>,
  ) => {
    return pickBy(
      filterVariables(filters)(context.variables),
      (variable) =>
        variable.system ||
        context.history.nodes.some(
          (historyEntry) => historyEntry.id === variable.id,
        ),
    );
  };

export const getVariable = (
  interpreterContext: TModuleVariableValue,
  nodeId: TNodeId,
) => {
  return interpreterContext.variables[nodeId];
};

export const getCurrentNodeId = (context: TModuleVariableValue) => {
  const id = context.history.nodes[context.history.position]?.id;

  if (!id) {
    throw new Error(
      "No current node found in the context. This is a bug in the interpreter, because it should always have at least the startnode in history.",
    );
  }

  return id;
};

export const getCurrentNode = <TNode extends INode>(
  treeClient: TTreeClient,
  context: TModuleVariableValue,
  type?: string,
) => {
  return treeClient.nodes.get.single<TNode>(getCurrentNodeId(context), type);
};

export const getVariablesOnPath = (context: TModuleVariableValue) => {
  return pickBy(
    context.variables,
    (variable) =>
      variable.id.includes("globalVariables") ||
      context.history.nodes.some(
        (historyEntry) => historyEntry.id === variable.id,
      ),
  );
};

export function createInterpreterMethods<TNodeType extends INode>(
  context: Context<any>,
  treeClient: TTreeClient,
) {
  return {
    getCurrentNode: <TNode extends TNodeType>(type?: TNode["type"]) =>
      getCurrentNode<TNode>(treeClient, context, type),
    getVariables: getVariables(context),
    getVariable: (nodeId: TNodeId) => getVariable(context, nodeId),
    hasHistory: () => context.history.nodes.length > 1,
    getVariablesOnPath: () => getVariablesOnPath(context),
  };
}
