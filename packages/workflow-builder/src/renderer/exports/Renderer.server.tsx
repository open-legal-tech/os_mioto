import "server-only";
import type { checkAuthWithAnonymus } from "@mioto/server/db/checkAuthenticated";
import type { getCurrentUser } from "@mioto/server/db/getCurrentUser";
import type {
  PersistSessionFn,
  RetrieveSessionFn,
  onSessionDoneFn,
} from "../../interpreter/exports/interpreter";
import { RendererClient } from "../components/RendererClient";
import type { SharedRendererProps } from "../types";
import { finishSession } from "./finishSession.action";
import { persistSession } from "./persistSession.action";
import { retrieveSessionFromSnapshot } from "./retrieveSessionFromSnapshot.action";

export type RendererProps = SharedRendererProps & {
  getAuthorization: () =>
    | ReturnType<typeof getCurrentUser>
    | ReturnType<typeof checkAuthWithAnonymus>;
};

export async function Renderer({
  environment,
  getAuthorization,
  session,
  ...props
}: RendererProps) {
  const persist: PersistSessionFn = async (params) => {
    "use server";

    const { db } = await getAuthorization();
    return persistSession(db)(params);
  };

  const onDone: onSessionDoneFn = async (params) => {
    "use server";

    const { db } = await getAuthorization();
    return finishSession(db)(params);
  };

  const retrieve: RetrieveSessionFn = async (params) => {
    "use server";

    const { user, db } = await getAuthorization();

    return retrieveSessionFromSnapshot(db, user.uuid)(params);
  };

  return (
    <RendererClient
      environment={environment}
      session={session}
      persistSession={persist}
      retrieveSession={retrieve}
      onDone={onDone}
      {...props}
    />
  );
}
