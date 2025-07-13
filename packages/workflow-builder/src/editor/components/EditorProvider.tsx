"use client";

import type { APP_ENV } from "@mioto/env/createEnv";
import { TreeWebsocketProvider } from "../../tree/sync/treeStore/TreeWebsocket";
import {
  ReactFlowProvider,
  EditorProvider as SystemEditorProvider,
} from "../useEditor";

type Props = {
  children: React.ReactNode;
  treeUuid: string;
  SYNCSERVER_ENDPOINT: string;
  APP_ENV: APP_ENV;
};

export const EditorProvider = ({
  children,
  treeUuid,
  SYNCSERVER_ENDPOINT,
  APP_ENV,
}: Props) => {
  return (
    <TreeWebsocketProvider
      id={treeUuid}
      SYNCSERVER_ENDPOINT={SYNCSERVER_ENDPOINT}
      APP_ENV={APP_ENV}
    >
      <ReactFlowProvider>
        <SystemEditorProvider>{children}</SystemEditorProvider>
      </ReactFlowProvider>
    </TreeWebsocketProvider>
  );
};
