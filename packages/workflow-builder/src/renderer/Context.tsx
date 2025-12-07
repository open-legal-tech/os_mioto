"use client";

import { FatalError } from "@mioto/errors";
import { useLocale } from "@mioto/locale";
import { type useActor, useActorRef } from "@xstate/react";
import { useSelector } from "@xstate/react";
import React from "react";
import type { z } from "zod";
import {
  type InterpreterActor,
  type InterpreterConfig,
  type Session,
  createInterpreterMachine,
} from "../interpreter/exports/interpreter";
import {
  createInterpreterMethods,
  getCurrentNode,
} from "../interpreter/exports/methods";
import type { TNodeId } from "../tree/id";
import { useTreeContext } from "../tree/sync/state";
import { useTreeClient } from "../tree/sync/treeStore/TreeContext";
import { debounce } from "../utils/debounce";
import { resetSessionAction } from "./exports/resetSessionAction";

type InterpreterActorRefReturn = ReturnType<
  typeof useActorRef<InterpreterActor>
>;
type InterpreterActorReturn = ReturnType<typeof useActor<InterpreterActor>>;

const Context = React.createContext<
  ReturnType<typeof createContextValue> | undefined
>(undefined);

const createContextValue = ({
  actor,
  userUuid,
  environment,
  session,
  startNodeId,
  locale,
  withResetConfirmation,
  RestartButton,
}: {
  actor: InterpreterActorRefReturn;
  userUuid: string;
  environment?: InterpreterConfig["environment"];
  session: Session;
  startNodeId: TNodeId;
  locale: string;
  withResetConfirmation?: boolean;
  RestartButton?: React.ReactNode;
}) => ({
  actor,
  send: actor.send,
  config: {
    userUuid,
    environment: environment ?? "private",
    sessionUuid: session.uuid,
    ownerUuid: session.ownerUuid,
    treeUuid: session.treeUuid,
    startNodeId,
    locale,
    withResetConfirmation:
      withResetConfirmation != null ? withResetConfirmation : true,
    RestartButton,
  },
});

export type RetrieveSessionOnClientFn = (params: {
  sessionUuid: string;
  treeUuid: string;
}) => Promise<Session | null>;

export type ProviderProps = {
  children: React.ReactNode;
  session: Session;
  withResetConfirmation?: boolean;
  treeUuid: string;
  userUuid: string;
  RestartButton?: React.ReactNode;
} & Pick<InterpreterConfig, "environment" | "onError">;

export const RendererProvider = ({
  children,
  environment,
  onError,
  withResetConfirmation,
  session: initialSession,
  userUuid,
  RestartButton,
}: ProviderProps) => {
  const locale = useLocale();
  const { treeMap } = useTreeContext();
  const { treeClient, nodePlugins } = useTreeClient();

  const startNodeId = treeClient.get.startNodeId();

  if (!startNodeId) throw new FatalError({ code: "missing_startNode" });

  const [machine] = React.useState(
    createInterpreterMachine({
      locale,
      environment,
      treeClient,
      treeUuid: initialSession.treeUuid,
      sessionUuid: initialSession.uuid,
      onError,
      onReset: async () => {
        await resetSessionAction({
          sessionUuid: initialSession.uuid,
          userUuid,
        });
      },
      userUuid,
      nodePlugins,
    }),
  );

  const actor = useActorRef(machine, {
    input:
      initialSession.state?.history?.nodes?.length > 0
        ? initialSession.state
        : undefined,
  });

  const debouncedInterpreterRestart = debounce(() => {
    actor.send({ type: "RESTART" });
  }, 500);

  treeMap.observeDeep(() => {
    debouncedInterpreterRestart();
  });

  return (
    <Context.Provider
      value={createContextValue({
        actor,
        userUuid,
        environment,
        session: initialSession,
        startNodeId,
        locale,
        withResetConfirmation,
        RestartButton,
      })}
    >
      {children}
    </Context.Provider>
  );
};

export const useRendererContext = () => {
  const context = React.useContext(Context);

  if (!context) {
    throw new FatalError({
      code: "missing_context",
      debugMessage:
        "You are missing the RendererPrimitives.Provider around your Renderer components.",
    });
  }

  return context;
};

export const useRendererMethods = () => {
  const { treeClient, NodeType } = useTreeClient();

  const context = useInterpreter((state) => state.context);

  return createInterpreterMethods<z.infer<typeof NodeType>>(
    context,
    treeClient,
  );
};

export const useCurrentNode = () => {
  const { treeClient } = useTreeClient();
  return useInterpreter((state) => getCurrentNode(treeClient, state.context));
};

// JSX makes it necessary to extend any, because otherwise this is incorrectly understood as jsx
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const useInterpreter = <TReturn,>(
  selector: (state: InterpreterActorReturn[0]) => TReturn,
) => {
  const { actor } = useRendererContext();

  return useSelector(actor, selector);
};
