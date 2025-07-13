"use client";

import { RendererClient, type RendererClientProps } from "./RendererClient";

export function WebsocketRendererClient({
  session,
  ...props
}: Pick<
  RendererClientProps,
  | "persistSession"
  | "onDone"
  | "retrieveSession"
  | "userUuid"
  | "session"
  | "RestartButton"
>) {
  return (
    <RendererClient
      withResetConfirmation={false}
      session={session}
      environment="private"
      {...props}
    />
  );
}
