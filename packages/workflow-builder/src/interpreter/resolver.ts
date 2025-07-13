import { type FailureBody, FatalError } from "@mioto/errors";
import type { TEdgeId, TNodeId } from "../tree/id";
import type { IEdge } from "../tree/type/plugin/EdgePlugin";
import type { INode } from "../tree/type/plugin/NodePlugin";
import type { TTreeClient } from "../tree/type/treeClient";
import type {
  IRecordVariable,
  TModuleVariableHistory,
  TModuleVariableValue,
  Variable,
} from "../variables/exports/types";
import type { Resolver } from "./exports/interpreter";
import { resolverFns } from "./exports/interpreterConfig";
import {
  getCurrentNode,
  getVariable,
  getVariablesOnPath,
} from "./exports/methods";

export type EVALUATE = {
  type: "EVALUATE" | "";
  history?: TModuleVariableHistory;
  nodeId?: TNodeId;
  variable?: IRecordVariable;
  globalVariable?: IRecordVariable | Record<string, any>;
};

export type INVALID_EXECUTION<TErrorCodes extends string> = {
  type: "INVALID_EXECUTION";
  error: TErrorCodes;
};

export type TEdgeResolverConfig<TType extends IEdge> = {
  treeClient: TTreeClient;
  edge: TType;
};

export type TEdgeResolverEvent<TVariableType extends Variable | undefined> = {
  context: TModuleVariableValue;
  variable?: TVariableType;
  variables: Record<string, Variable>;
  node: INode;
};

export type EdgeResolver<
  TType extends IEdge = IEdge,
  TVariableType extends Variable = Variable,
> = (
  config: TEdgeResolverConfig<TType>,
) => (
  event: TEdgeResolverEvent<TVariableType>,
) =>
  | Readonly<{ state: "success"; target: TNodeId }>
  | Readonly<{ state: "failure" }>
  | Readonly<{ state: "error"; failure: FailureBody }>;

export function createResolver(treeClient: TTreeClient) {
  const resolvers = (edge: IEdge) => {
    if (!(edge.type in resolverFns)) {
      throw new FatalError({
        code: "invalid_edges",
        debugMessage: `The edge provided to the interpreter is not a found in the plugins. Make sure to include it in the edgePlugins passed to the Renderer.Root.`,
        parentError: edge,
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const edgeResolver = resolverFns[edge.type];

    if (!edgeResolver) {
      throw new Error(`Edge resolver for ${edge.type} not found.`);
    }

    return edgeResolver({ treeClient, edge });
  };

  const resolver: Resolver = ({ input: { context }, sendBack }) => {
    const currentNode = getCurrentNode(treeClient, context);
    const pathVariables = getVariablesOnPath(context);
    const targetName = (id?: TNodeId) =>
      id ? treeClient.nodes.get.single(id).name : "";

    const edges = currentNode.edges
      ? treeClient.edges.get.collection(currentNode.edges)
      : treeClient.edges.get.byNode(currentNode.id)?.source;

    const fallbackEdgeId = treeClient.nodes.get.single(
      currentNode.id,
    )?.fallbackEdge;

    const fallbackEdgeTarget = fallbackEdgeId
      ? treeClient.edges.get.single(fallbackEdgeId)?.target
      : undefined;

    if (!edges && !fallbackEdgeTarget) {
      console.log(
        "%cInvalid Interpretation: No edges and fallbackEdge found on the block.",
        "color: red;",
      );
      return sendBack({
        type: "INVALID_INTERPRETATION",
        error: "missing_edges_for_node",
      });
    }

    const edgesArray = Object.values(edges ?? {});
    if (
      edgesArray.length === 1 &&
      edgesArray[0]?.target &&
      !fallbackEdgeTarget
    ) {
      console.log(
        `%cDirektverbindung zu ${targetName(edgesArray[0].target)} gefunden.`,
        "color: green;",
      );
      return sendBack({
        type: "VALID_INTERPRETATION",
        target: edgesArray[0].target,
      });
    }

    const variable = getVariable(context, currentNode.id);

    for (const key in edges) {
      const edge = edges[key as TEdgeId];

      if (!edge) {
        throw new Error(
          "Edge not found. When looping with for loop. This should never happen.",
        );
      }

      if (!edge.target) {
        console.log(`%cVerbindung ${edge.id} hat kein Ziel.`, "color: red;");
        continue;
      }

      const edgeResolver = resolvers(edge);

      const result = edgeResolver({
        context,
        variable,
        variables: pathVariables,
        node: currentNode,
      });

      // If the result is false the condition was not true and we
      // can continue with the next condition.
      if (result.state === "failure") {
        console.log(
          `%cVerbindung zu ${targetName(edge.target)} is nicht gültig.`,
          "color: purple;",
        );
        continue;
      }

      // If the result is an error we fail the interpretation, because
      // we can not resolve the tree correctly.
      // See the error message for what went wrong.
      if (result.state === "error") {
        console.log(
          `%cEdge ${targetName} failed with error: ${result.failure.code}`,
          "color: red;",
        );

        return sendBack({
          type: "INVALID_INTERPRETATION",
          error: result.failure.code,
        });
      }

      console.log(
        `%cVerbindung zu ${targetName(edge.target)} is gültig.`,
        "color: green;",
      );
      return sendBack({
        type: "VALID_INTERPRETATION",
        target: result.target,
        history: context.history,
      });
    }

    // If no other condition matched we fallback to the fallback conditions target.
    // If it is not set nothing happens.
    if (fallbackEdgeTarget) {
      console.log(
        `%cKeine Verbindung ist gültig. Nehme Rückfallverbindung zu ${targetName(
          fallbackEdgeTarget,
        )}.`,
        "color: orange;",
      );
      return sendBack({
        type: "VALID_INTERPRETATION",
        target: fallbackEdgeTarget,
        history: context.history,
      });
    }

    console.log(
      "%cKeine Verbindung ist gültig und keine Rückfallverbindung existiert.",
      "color: red;",
    );
    return sendBack({
      type: "INVALID_INTERPRETATION",
      error: "no_edge_matched",
    });
  };

  return resolver;
}
