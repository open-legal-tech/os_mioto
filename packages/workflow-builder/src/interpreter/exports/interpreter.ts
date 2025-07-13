import { FatalError } from "@mioto/errors";
import type { SessionStatus } from "@mioto/prisma";
import type { ValuesType } from "utility-types";
import { assertEvent, assign, fromCallback, fromPromise, setup } from "xstate";
import { GlobalVariablesNode } from "../../plugins/node/global-variables/plugin";
import type { TNodeId } from "../../tree/id";
import type { NodePlugin } from "../../tree/type/plugin/NodePlugin";
import type { TTreeClient } from "../../tree/type/treeClient";
import type {
  IRecordVariable,
  TModuleVariableHistory,
  TModuleVariableValue,
} from "../../variables/exports/types";
import { createEmptySessionState } from "../createEmptySessionState";
import { executeNode } from "../executeNode";
import {
  type EVALUATE,
  type INVALID_EXECUTION,
  createResolver,
} from "../resolver";
import { getNodePositionFromHistory } from "../utils/getNodePositionFromHistory";
import {
  type InterpreterActionParams,
  type InterpreterActionReturn,
  type TActionErrors,
  actions,
  renderPlugins,
} from "./interpreterConfig";
import {
  type createInterpreterMethods,
  getCurrentNode,
  getCurrentNodeId,
} from "./methods";

function leaveHandler(event: BeforeUnloadEvent) {
  const message =
    "A network call is still in progress. Do you really want to leave?";
  event.preventDefault();
  return message;
}

export type Session = {
  uuid: string;
  name: string;
  status: SessionStatus;
  ownerUuid: string | null;
  treeUuid: string;
  state: TModuleVariableValue<TActionErrors>;
  treeSnapshotUuid: string | null;
};

export type Resolver = Parameters<
  typeof fromCallback<ResolverEvents, { context: TModuleVariableValue }>
>[0];

export type INVALID_INTERPRETATION = {
  type: "INVALID_INTERPRETATION";
  error: "missing_edges_for_node" | "no_edge_matched";
};

export type ResolverEvents =
  | {
      type: "VALID_INTERPRETATION";
      target: TNodeId;
      history?: TModuleVariableHistory;
    }
  | INVALID_INTERPRETATION;

export type ExecuteEvents = EVALUATE | INVALID_EXECUTION<TActionErrors>;

export type PersistenceEvents =
  | { type: "PERSISTED" }
  | { type: "PERSISTENCE_FAILURE" };

export type InterpreterEvents =
  | { type: "xstate.init" }
  | { type: "DONE" }
  | { type: "GO_BACK" }
  | { type: "GO_FORWARD" }
  | { type: "JUMP_TO_NODE"; target: TNodeId }
  | { type: "RESTART" }
  | { type: "RESET" }
  | { type: "EDITING" }
  | { type: "JUMPING" }
  | { type: "PERSIST" }
  | { type: "PERSISTENCE_SKIPPED" }
  | { type: "VALIDATE_SESSION" }
  | ResolverEvents
  | ExecuteEvents
  | EVALUATE
  | PersistenceEvents;

export type InterpreterActor = ReturnType<typeof createInterpreterMachine>;

export type TInterpreterEnvironments = "private" | "published";

export type PersistSessionFn = (params: {
  sessionUuid: string;
  treeUuid: string;
  history: { nodes: TModuleVariableHistory; position: number };
  error: string | undefined;
  variables?: string;
}) => Promise<boolean>;

type RetrieveSessionFnReturn = {
  treeClient: TTreeClient;
  session: Session;
} & ReturnType<typeof createInterpreterMethods>;

export type RetrieveSessionFn = (params: {
  sessionUuid: string;
  treeUuid: string;
}) => Promise<RetrieveSessionFnReturn> | RetrieveSessionFnReturn;

export type onSessionDoneFn = (params: {
  sessionUuid: string;
  context: TModuleVariableValue;
}) => boolean | Promise<boolean>;

export type ExtractErrorCodesFromPluginActions<
  TActions extends Record<
    string,
    (params: InterpreterActionParams) => Promise<InterpreterActionReturn<any>>
  >,
> = Extract<
  Awaited<ReturnType<NonNullable<ValuesType<TActions>>>>,
  INVALID_EXECUTION<string>
>["error"];

export type InterpreterConfig = {
  onSelectedNodeChange?: (
    nextNodeId: TModuleVariableHistory[number]["id"],
    context: TModuleVariableValue,
  ) => void;
  onError?: (error?: Context["error"]) => void;
  onDone?: onSessionDoneFn;
  onReset?: () => void | Promise<void>;
  environment: TInterpreterEnvironments;
  treeClient: TTreeClient;
  nodePlugins: Record<string, NodePlugin>;
  treeUuid: string;
  sessionUuid: string;
  persistSession: PersistSessionFn;
  retrieveSession: RetrieveSessionFn;
  userUuid: string;
  locale: string;
};

export type Context<TErrors extends string = string> = TModuleVariableValue<
  TErrors | INVALID_INTERPRETATION["error"]
>;

export const createInterpreterMachine = ({
  onSelectedNodeChange,
  onError,
  onDone,
  onReset,
  treeClient,
  nodePlugins,
  environment,
  treeUuid,
  sessionUuid,
  persistSession,
  retrieveSession,
  userUuid,
  locale,
}: InterpreterConfig) => {
  return setup({
    types: {} as {
      context: Context<TActionErrors | "unknown_error">;
      events: InterpreterEvents;
      input: TModuleVariableValue<TActionErrors | "unknown_error">;
    },
    actions: {
      setUnloadHandler: () => {
        window.addEventListener("beforeunload", leaveHandler);
      },
      removeUnloadHandler: () => {
        window.removeEventListener("beforeunload", leaveHandler);
      },
      setPositionToEarliestAvailableNode: assign({
        history: ({ context }) => {
          const earliestInvalidHistoryEntry =
            context.history.nodes.findLastIndex(
              (node) => !treeClient.nodes.has(node.id),
            );

          if (earliestInvalidHistoryEntry !== -1) {
            return {
              nodes: context.history.nodes.slice(
                earliestInvalidHistoryEntry + 1,
              ),
              position: 0,
            };
          }

          return context.history;
        },
      }),
      assignErrorToContext: assign({
        error: ({ event }) => {
          assertEvent(event, ["INVALID_EXECUTION", "INVALID_INTERPRETATION"]);

          return event.error;
        },
      }),
      assignAnswerToContext: assign(({ context, event }) => {
        assertEvent(event, "EVALUATE");
        const currentGlobalVariable = context.variables[GlobalVariablesNode.id];

        if (!currentGlobalVariable) {
          throw new Error("Global variable has not been initialized");
        }

        const globalVariable = event.globalVariable;

        const newGlobalVariable =
          globalVariable && globalVariable?.type === "record"
            ? globalVariable
            : ({
                ...currentGlobalVariable,
                value: {
                  ...currentGlobalVariable?.value,
                  ...globalVariable,
                },
              } as IRecordVariable);

        const eventVariable = event.variable
          ? { [event.variable.id]: event.variable }
          : {};

        return {
          variables: {
            ...context.variables,
            ...eventVariable,
            [GlobalVariablesNode.id]: newGlobalVariable,
          },
        };
      }),
      goBack: assign(({ context }) => {
        // When there is no history we should not go back.
        if (context.history.nodes.length === 0) {
          return context;
        }

        // When we have reached the end of the history array we should not go back further.
        if (context.history.position === context.history.nodes.length - 1) {
          return context;
        }

        const previousNode = getNodePositionFromHistory({
          context,
          treeClient,
          direction: "backward",
          nodePlugins,
        });

        // If we cannot find a previous node we should not go back.
        if (!previousNode) return context;
        onSelectedNodeChange?.(previousNode.id, context);

        return {
          history: {
            // We assign the position that we found in the getPreviousNode function.
            position: previousNode.position,
            nodes: context.history.nodes,
          },
        };
      }),
      goForward: assign(({ context }) => {
        // If we are at the start of the history we should not go forward.
        if (context.history.position === 0) return context;

        const nextNode = getNodePositionFromHistory({
          context,
          treeClient,
          direction: "forward",
          nodePlugins,
        });

        // If we cannot find a next node we should not go forward.
        if (!nextNode) return context;

        onSelectedNodeChange?.(nextNode.id, context);

        return {
          history: {
            // We assign the position that we found in the getNextNode function.
            position: nextNode.position,
            nodes: context.history.nodes,
          },
        };
      }),
      assignNewTarget: assign(({ context, event }) => {
        assertEvent(event, "VALID_INTERPRETATION");
        onSelectedNodeChange?.(event.target, context);

        // Split the existing history by the current position. This enables the user to
        // go back and change an answer and go into a new direction.
        const previousHistory =
          context.history.position !== 0
            ? context.history.nodes.slice(
                context.history.position,
                context.history.nodes.length,
              )
            : context.history.nodes;

        const history = [
          // Add the target node to the history stack at the front
          { id: event.target },
          ...previousHistory,
        ];

        return {
          history: {
            position: 0,
            nodes: history,
          },
        };
      }),
      assignEmptyState: assign(() => {
        const startNodeId = treeClient.get.startNodeId();

        if (!startNodeId) throw new FatalError({ code: "missing_startnode" });

        return {
          ...createEmptySessionState({
            startNodeId,
            initialContext: {
              variables: {
                [GlobalVariablesNode.id]: GlobalVariablesNode.createVariable({
                  nodeId: GlobalVariablesNode.id,
                })(treeClient).variable,
              },
            },
          }),
          error: undefined,
        };
      }),
    },
    actors: {
      resolveConditions: fromCallback(
        (() => {
          return createResolver(treeClient);
        })(),
      ),
      executeNode: fromCallback(({ sendBack }) => {
        (async () => {
          const result = await executeNode({
            environment,
            sessionUuid,
            treeUuid,
            retrieveSession,
            userUuid,
            locale,
          }).then((r) => r.promise);

          sendBack(result);
        })();
      }),
      persistSession: fromPromise<true, { context: Context }>(
        async ({ input: { context } }) => {
          const result = await persistSession({
            treeUuid,
            sessionUuid,
            history: context.history,
            variables: JSON.stringify(context.variables),
            error: context.error,
          });

          if (!result) throw new Error("Failed to persist session");

          return true;
        },
      ),
      resetSession: fromPromise<true, { context: Context }>(
        async ({ input: { context } }) => {
          const [, result] = await Promise.all([
            onReset?.(),
            persistSession({
              treeUuid,
              sessionUuid,
              history: context.history,
              variables: JSON.stringify(context.variables),
              error: context.error,
            }),
          ]);

          if (!result) throw new Error("Failed to persist session");

          return true;
        },
      ),
    },
    guards: {
      canGoBack: ({ context }) => {
        return !!getNodePositionFromHistory({
          context,
          treeClient,
          direction: "backward",
          nodePlugins,
        });
      },
      canGoForward: ({ context }) => {
        return !!getNodePositionFromHistory({
          context,
          treeClient,
          direction: "forward",
          nodePlugins,
        });
      },
      canEvaluate: ({ context, event }) => {
        assertEvent(event, "EVALUATE");
        return event.nodeId === getCurrentNodeId(context);
      },
      isActionNode: ({ context }) => {
        return !!actions[getCurrentNode(treeClient, context).type];
      },
      noRenderer: ({ context }) => {
        return !renderPlugins[getCurrentNode(treeClient, context).type];
      },
      isFinalNode: ({ context }) => {
        return getCurrentNode(treeClient, context).final;
      },
      canGoBackFromError: ({ context }) => {
        return (
          environment === "private" &&
          !!getNodePositionFromHistory({
            context,
            treeClient,
            direction: "backward",
            nodePlugins,
          })
        );
      },
    },
  }).createMachine({
    context: ({ input }) => {
      if (input) return input;

      const startNodeId = treeClient.get.startNodeId();

      if (!startNodeId) throw new FatalError({ code: "missing_startnode" });

      return {
        ...createEmptySessionState({
          startNodeId,
          initialContext: {
            variables: {
              [GlobalVariablesNode.id]: GlobalVariablesNode.createVariable({
                nodeId: GlobalVariablesNode.id,
              })(treeClient).variable,
            },
          },
        }),
      };
    },
    id: "interpreter",
    initial: "validate_tree",
    on: {
      DONE: {
        target: ".done",
      },
      RESET: {
        target: ".reset",
        actions: "assignEmptyState",
      },
      RESTART: {
        target: ".validate_tree",
      },
    },
    states: {
      validate_tree: {
        always: [
          {
            target: "error",
            guard: ({ context, event }) =>
              event.type !== "xstate.init" &&
              event.type !== "RESTART" &&
              !!context.error,
          },
          {
            target: "persist",
            guard: ({ context }) => {
              return (
                context.history.nodes.length === 1 &&
                Object.values(context.variables).filter(
                  (variable) => variable.id !== GlobalVariablesNode.id,
                ).length === 0
              );
            },
          },
          {
            target: "editing",
            actions: "setPositionToEarliestAvailableNode",
          },
        ],
      },
      editing: {
        always: [
          {
            target: "execute_action",
            guard: "isActionNode",
          },
          {
            target: "done",
            guard: "isFinalNode",
          },
          { target: "interpreting", guard: "noRenderer" },
        ],
        on: {
          EVALUATE: {
            actions: "assignAnswerToContext",
            target: "interpreting",
            guard: "canEvaluate",
          },
          GO_BACK: { guard: "canGoBack", actions: "goBack" },
          GO_FORWARD: {
            guard: "canGoForward",
            actions: "goForward",
          },
        },
      },
      execute_action: {
        invoke: {
          id: "execute_node",
          src: "executeNode",
          onError: {
            target: "error",
            actions: assign({
              error: "unknown_error",
            }),
          },
        },
        on: {
          EVALUATE: {
            target: "interpreting",
            actions: "assignAnswerToContext",
          },
          INVALID_EXECUTION: {
            target: "error",
            actions: "assignErrorToContext",
          },
        },
      },
      interpreting: {
        invoke: {
          id: "interpret_select_answer",
          src: "resolveConditions",
          input: ({ event, context }) => ({
            event,
            context,
          }),
        },
        on: {
          VALID_INTERPRETATION: {
            target: "persist",
            actions: "assignNewTarget",
          },
          INVALID_INTERPRETATION: {
            target: "error",
            actions: "assignErrorToContext",
          },
        },
      },
      persist: {
        invoke: {
          entry: "setUnloadHandler",
          exit: "removeUnloadHandler",
          id: "persist_interpreter_session",
          src: "persistSession",
          input: ({ context }) => ({ context }),
          onError: {
            target: "error",
            actions: assign({
              error: () => {
                return "unknown_error";
              },
            }),
          },
          onDone: {
            target: "editing",
          },
        },
      },
      reset: {
        invoke: {
          entry: "setUnloadHandler",
          exit: "removeUnloadHandler",
          id: "reset_interpreter_session",
          src: "resetSession",
          input: ({ context }) => ({ context }),
          onError: {
            target: "error",
            actions: assign({
              error: () => {
                return "unknown_error";
              },
            }),
          },
          onDone: {
            target: "editing",
          },
        },
      },
      error: {
        entry: ({ context }) => onError?.(context.error),
        invoke: {
          id: "persist_interpreter_session",
          src: "persistSession",
          input: ({ context }) => ({ context }),
        },
        on: {
          GO_BACK: {
            guard: "canGoBackFromError",
            target: "editing",
            actions: "goBack",
          },
        },
      },
      done: {
        entry: ({ context }) => onDone?.({ context, sessionUuid }),
      },
    },
  });
};
