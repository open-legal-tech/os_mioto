import { Logger } from "@hocuspocus/extension-logger";
import { Hocuspocus } from "@hocuspocus/server";
import { verifyAccessToken } from "@mioto/server/Token/subModels/AccessToken/verify";
import { getUserFromToken } from "@mioto/server/db/getUserFromToken";
import * as Sentry from "@sentry/node";
import express, { type RequestHandler } from "express";
import expressWebsockets from "express-ws";
import morgan from "morgan";
import { encodeStateAsUpdate } from "yjs";
import { syncServerEnv } from "../env";
import { CustomDataBase } from "./CustomDatabase";

export type Context = Awaited<ReturnType<typeof getUserFromToken>>;

export const websocketServer = new Hocuspocus({
  async onConnect({ connection }) {
    connection.requiresAuthentication = true;
  },
  async onAuthenticate(data) {
    const { user, db } = await getUserFromToken(data.token);

    const hasPermission = await db.tree.findUnique({
      where: {
        uuid: data.documentName,
        Employee: {
          some: {
            userUuid: user.uuid,
          },
        },
      },
    });

    if (!hasPermission)
      throw new Error("You do not have permission to access this document");

    return { user, db };
  },
  async onDestroy() {
    console.log(`Server was shut down!`);
  },
  async onLoadDocument({ document }) {
    return document;
  },
  name: "websocket",
  extensions: [new Logger(), new CustomDataBase()],
});

const { app } = expressWebsockets(express());

app.use(morgan("tiny"));

app.ws("/", async (ws, request) => {
  websocketServer.handleConnection(ws, request);
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.get("/:treeUuid", async function treeHandler(request, response) {
  const token = request.headers.authorization;

  if (token) {
    await verifyAccessToken({ token });
  } else {
    response.status(401);
    return;
  }

  const treeUuid = (request.params as { treeUuid: string })?.treeUuid;

  if (!treeUuid) {
    throw new Error("treeUuid is missing.");
  }

  const tree = websocketServer.documents.get(treeUuid);

  if (!tree) {
    response.status(404);
    response.send("Document not found");
    return;
  }

  response.send(Buffer.from(encodeStateAsUpdate(tree)));
});

Sentry.setupExpressErrorHandler(app);

app.listen(syncServerEnv.PORT, () =>
  console.log(`Listening on ${syncServerEnv.PORT}`),
);
