import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import type {
  PersistSessionFn,
  RetrieveSessionFn,
  onSessionDoneFn,
} from "../../interpreter/exports/interpreter";
import { WebsocketRendererClient } from "../components/WebsocketRenderer.client";
import type { SharedRendererProps } from "../types";
import { finishSession } from "./finishSession.action";
import { persistSession } from "./persistSession.action";
import { retrieveSessionFromTree } from "./retrieveSessionFromTree.action";

export type RendererProps = SharedRendererProps & {
  SYNCSERVER_ENDPOINT: string;
};

export function WebsocketRenderer({
  userUuid,
  session,
  ...props
}: RendererProps) {
  const retrieve: RetrieveSessionFn = async (params) => {
    "use server";

    const { db, token } = await getCurrentEmployee();
    return retrieveSessionFromTree(db, token)(params);
  };

  const persist: PersistSessionFn = async (params) => {
    "use server";

    const { db } = await getCurrentEmployee();
    return persistSession(db)(params);
  };

  const onDone: onSessionDoneFn = async (params) => {
    "use server";

    const { db } = await getCurrentEmployee();
    return finishSession(db)(params);
  };

  return (
    <WebsocketRendererClient
      persistSession={persist}
      session={session}
      userUuid={userUuid}
      onDone={onDone}
      retrieveSession={retrieve}
      {...props}
    />
  );
}
