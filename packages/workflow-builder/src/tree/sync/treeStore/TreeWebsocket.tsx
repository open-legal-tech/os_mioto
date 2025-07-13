"use client";

import { Failure } from "@mioto/errors";
import { useTranslations } from "@mioto/locale";
import { getTokenAction } from "@mioto/server/actions/getToken.action";
import { captureException } from "@sentry/nextjs";
import { useActorRef, useSelector } from "@xstate/react";
import React from "react";
import { createTreeClientPlugins } from "../../createTreeClientWithPlugins";
import { autoFix } from "../../exports/autoFix";
import { TreeClient } from "../../type/treeClient";
import {
  type ValidationError,
  createWebsocketMachine,
} from "../websocket.machine";
import { TreeContext } from "./TreeContext";
import { createTreeStore } from "./treeStore";
import type { APP_ENV } from "@mioto/env/createEnv";

type WebsocketActor = ReturnType<
  typeof useActorRef<ReturnType<typeof createWebsocketMachine>>
>;

type TreeWebsocketContext = {
  reconnect: () => void;
  websocketActorRef: WebsocketActor;
};

const TreeWebsocketContext = React.createContext<TreeWebsocketContext | null>(
  null,
);

type Props = {
  children: React.ReactNode;
  id: string;
  SYNCSERVER_ENDPOINT: string;
  APP_ENV: APP_ENV;
};

export function TreeWebsocketProvider({
  id,
  children,
  SYNCSERVER_ENDPOINT,
  APP_ENV,
}: Props) {
  const t = useTranslations();
  const treeStore = React.useMemo(() => createTreeStore(id), [id]);

  const [websocketMachine] = React.useState(
    createWebsocketMachine({
      SYNCSERVER_ENDPOINT,
      APP_ENV,
      id,
      yDoc: treeStore.treeDoc,
      onAuthenticate: async (callback) => {
        try {
          const result = await getTokenAction();

          if (!result.success)
            return callback({ type: "AUTHENTICATION_FAILED" });

          callback({ type: "AUTHENTICATED", token: result.data.token });
        } catch (e) {
          console.log(e);
          return callback({ type: "AUTHENTICATION_FAILED" });
        }
      },
      onMigrate: async () => {
        const fixMap = await autoFix({
          store: treeStore.tree,
          yMap: treeStore.treeMap,
          t,
        });

        if (fixMap instanceof Failure) {
          const migrationResult = treeStore.treeMap.toJSON();
          treeStore.undo();
          captureException(fixMap, {
            level: "warning",
            tags: { type: "tree-validation" },
            extra: { fixMap },
          });

          return {
            success: false,
            validationError: { failure: fixMap, migrationResult },
          };
        }

        return { success: true };
      },
    }),
  );

  const websocketActorRef = useActorRef(websocketMachine);

  const reconnect = React.useCallback(
    () => websocketActorRef.send({ type: "RECONNECT" }),
    [websocketActorRef.send],
  );

  const treeClient = new TreeClient(treeStore.tree, treeStore.treeMap);
  const plugins = createTreeClientPlugins(treeClient);

  return (
    <TreeContext.Provider value={{ ...treeStore, treeClient, plugins }}>
      <TreeWebsocketContext.Provider value={{ reconnect, websocketActorRef }}>
        {children}
      </TreeWebsocketContext.Provider>
    </TreeContext.Provider>
  );
}

export const useTreeWebsocketContext = () => {
  const context = React.useContext(TreeWebsocketContext);

  if (!context)
    throw new Error(
      `useTreeWebsocketContext can only be used when nested inside of a TreeWebsocketProvider`,
    );

  return context;
};

export const useIsSynced = () => {
  const { websocketActorRef } = useTreeWebsocketContext();

  return useSelector(websocketActorRef, (state) => {
    return state.context.synced;
  });
};

export const useIsPaused = () => {
  const { websocketActorRef } = useTreeWebsocketContext();
  return useSelector(websocketActorRef, (state) => state.matches("paused"));
};

export const useIsError = () => {
  const { websocketActorRef } = useTreeWebsocketContext();
  return useSelector(websocketActorRef, (state) => state.matches("error"));
};

export const useIsInvalid = () => {
  const { websocketActorRef } = useTreeWebsocketContext();
  return useSelector(websocketActorRef, (state) => {
    if (state.matches("invalid-tree")) {
      return {
        isInvalid: true,
        validationError: state.context
          .validationError as Required<ValidationError>,
      } as const;
    }

    return { isInvalid: false, validationError: undefined } as const;
  });
};
