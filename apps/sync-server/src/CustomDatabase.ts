import { Database } from "@hocuspocus/extension-database";
import type {
  Extension,
  onChangePayload,
  onLoadDocumentPayload,
  onStatelessPayload,
} from "@hocuspocus/server";
import { isPrismaClientKnownRequestError } from "@zenstackhq/runtime";
import type { Context } from ".";

const db = new Database({
  fetch: async ({ documentName, context }) => {
    const { user, db } = context as Context;
    const data = await db.tree.findUnique({
      where: {
        uuid: documentName,
        Employee: {
          some: {
            userUuid: user.uuid,
          },
        },
      },
    });

    if (!data) throw new Error("You do not have access to this document");

    return data.document;
  },
  store: async ({ documentName, state, document, context }) => {
    const { db, user } = context as Context;

    try {
      await db.tree.update({
        data: {
          document: Buffer.from(state),
        },
        where: {
          organizationUuid: user.organizationUuid,
          uuid: documentName,
          Employee: {
            some: {
              userUuid: user.uuid,
            },
          },
        },
      });
    } catch (error) {
      if (!isPrismaClientKnownRequestError(error)) {
        console.log(error);
      }
      // An error here means we could not update the document
      // This can happen when the tree is deleted from the database
      // We terminate the connection as a result
      document.destroy();
    }

    document.broadcastStateless("db-in-sync");
  },
});

export class CustomDataBase implements Extension {
  changePayload: onChangePayload | null = null;

  async onStoreDocument(data: onChangePayload): Promise<any> {
    const promise = await db.onStoreDocument(data);

    this.changePayload = null;

    return promise;
  }
  onLoadDocument(data: onLoadDocumentPayload): Promise<any> {
    return db.onLoadDocument(data);
  }

  onChange({ document, ...changePayload }: onChangePayload): Promise<any> {
    document.broadcastStateless("db-out-of-sync");

    this.changePayload = { document, ...changePayload };
    return Promise.resolve();
  }

  async onStateless({ payload, document }: onStatelessPayload): Promise<any> {
    if (payload === "db-store") {
      if (this.changePayload) {
        await db.onStoreDocument(this.changePayload);
      }

      document.broadcastStateless("db-in-sync");
    }
  }
}
