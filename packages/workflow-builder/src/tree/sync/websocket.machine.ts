import { HocuspocusProvider } from "@hocuspocus/provider";
import type { Failure } from "@mioto/errors";
import { assertEvent, assign, fromCallback, setup } from "xstate";
import { IndexeddbPersistence } from "y-indexeddb";
import type { Doc } from "yjs";
import type { Unfixable } from "../exports/autoFix";
import type { APP_ENV } from "@mioto/env/createEnv";
export type ValidationError = {
  failure?: Failure<"unfixable_tree", never, Unfixable[]>;
  migrationResult?: any;
};

type Context = {
  retryLimit: number;
  retries: number;
  token: string;
  synced: boolean;
  error?: string;
  validationError?: ValidationError;
};

type WebsocketCallbackEvents =
  | { type: "connection.ready" }
  | { type: "connection.error"; error?: Error }
  | { type: "connection.disconnected" }
  | { type: "connection.authenticationFailed"; reason: string }
  | { type: "connection.store" }
  | { type: "connection.edit" }
  | {
      type: "migration.failed";
      validationError: ValidationError;
    };

type Events =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SYNC" }
  | { type: "RECONNECT" }
  | { type: "INTERACTION" }
  | { type: "RETRY" }
  | WebsocketCallbackEvents
  | AuthenticationEvents;

type AuthenticationEvents =
  | { type: "AUTHENTICATED"; token: string }
  | { type: "AUTHENTICATION_FAILED" };

export const createWebsocketMachine = (config: {
  id: string;
  yDoc: Doc;
  onAuthenticate: (callback: (event: AuthenticationEvents) => void) => void;
  onMigrate: () => Promise<
    | { success: true; validationError?: never }
    | {
        success: false;
        validationError: ValidationError;
      }
  >;
  SYNCSERVER_ENDPOINT: string;
  APP_ENV: APP_ENV;
}) =>
  setup({
    types: {} as {
      context: Context;
      events: Events;
      services: {
        openWebsocket: {
          data: { websocket: HocuspocusProvider };
        };
        authenticate: {
          data: { token: string };
        };
      };
    },
    actors: {
      authenticate: fromCallback(({ sendBack }) => {
        config.onAuthenticate(sendBack);
      }),
      listenToInteraction: fromCallback(({ sendBack }) => {
        const handler = () => {
          sendBack({ type: "INTERACTION" });
        };
        const events = ["mousemove", "keypress"];
        events.forEach((event) => {
          window.addEventListener(event, handler);
        });

        return () => {
          events.forEach((event) => {
            window.removeEventListener(event, handler);
          });
        };
      }),
      openWebsocket: fromCallback<Events, { token: string }>(
        ({ sendBack, input: { token }, receive }) => {
          const onSync = async () => {
            const result = await config.onMigrate?.();

            return sendBack(
              result?.success
                ? { type: "connection.ready" }
                : {
                    type: "migration.failed",
                    validationError: result.validationError,
                  },
            );
          };

          const indexedDBPersistence = new IndexeddbPersistence(
            config.id,
            config.yDoc,
          );

          indexedDBPersistence.on(
            "synced",
            async (idbPersistence: IndexeddbPersistence) => {
              if (idbPersistence.doc.getMap("tree").get("nodes") != null) {
                await onSync();
              }
            },
          );

          console.time("Websocket load time");

          const websocket = new HocuspocusProvider({
            url: config.SYNCSERVER_ENDPOINT,
            name: config.id,
            document: config.yDoc,
            token,
            //@ts-expect-error - this is a bug in the type definition
            maxAttempts: 1,
            onAuthenticationFailed: ({ reason }) => {
              console.log(reason);
              sendBack({
                type: "connection.authenticationFailed",
                reason,
              });
            },
            onOpen: () => console.log("opened sync engine v2"),
            onClose: () => {
              console.log("closed sync engine v2");
              sendBack({ type: "connection.disconnected" });
            },
            onSynced: async () => {
              console.log("synced with sync engine v2");
              await onSync();
              console.timeEnd("Websocket load time");
            },
            onDisconnect: () => {
              console.log("disconnected from sync engine v2");
              sendBack({ type: "connection.disconnected" });
            },
            onDestroy: () => {
              console.log("destroyed sync engine v2");
              sendBack({ type: "connection.disconnected" });
            },
            onStateless: ({ payload }) => {
              if (payload === "db-out-of-sync") {
                sendBack({ type: "connection.edit" });
              }

              if (payload === "db-in-sync") {
                sendBack({ type: "connection.store" });
              }
            },
          });

          // To allow e2e test to simulate websocket failures we set the websocket
          // on the window object
          if (config.APP_ENV !== "production") {
            (window as any).syncServer = websocket;
          }

          receive((event) => {
            if (event.type === "SYNC") {
              websocket.sendStateless("db-store");
            }
          });

          return () => {
            console.log("cleanup websocket");
            // See issue https://github.com/ueberdosis/hocuspocus/issues/642 for why we need to destroy both
            websocket.configuration.websocketProvider.destroy();
            websocket.destroy();
            indexedDBPersistence.destroy();
          };
        },
      ),
    },
    actions: {
      assignTokenToContext: assign({
        token: ({ event }) => {
          assertEvent(event, "AUTHENTICATED");
          return event.token;
        },
      }),
      assignValidationError: assign({
        validationError: ({ event }) => {
          assertEvent(event, "migration.failed");
          return event.validationError;
        },
      }),
      markSynced: assign({ synced: () => true }),
      resetSynced: assign({ synced: () => false }),
      incrementRetries: assign({
        retries: ({ context }) => context.retries + 1,
      }),
      resetRetries: assign({
        retries: () => 0,
      }),
      assignReason: assign({
        error: ({ event }) => {
          assertEvent(event, "connection.authenticationFailed");
          return event.reason;
        },
      }),
    },
    guards: {
      shouldRetry: ({ context }) => context.retries < context.retryLimit,
      isNotPermitted: ({ event }) => {
        assertEvent(event, "connection.authenticationFailed");
        return event.reason === "permission-denied";
      },
    },
    delays: {
      retry_delay: ({ context }) => Math.min(context.retries * 1000, 20000),
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgCcwAXMgTwGIAPWS9SsE9AMzbOQupoB9CGAA26GkTposeQqX60A2gAYAuolAAHAPaxclXDvyaQDRACYVAFgCMJCwFYAzLduObATk8AOFQDYAGhAaRA9-Eh83f09bV3d-RwBfJOCZHAJiDgBXSmwwfENMVgIoOgBBAFUAFQAJAFEAOWqASQBhcur6gBFVDSQQXX1DY1NzBDjbAHYSR0SbKcXHH2tHC2DQhGtnCxJbGxVPfxWp-yWplLSMDPkcvIKikvwyqrqm1o7WgHlGwQAxcotAAyPT6piGBiMJgG41sPmcnj2jk8CICFmsKlcng2YW8JE8TlsZ18Pn8zh8yVSIHSciy6Fy+UKuGKhmeFRqDWa7U6LR+-0BIN6tn62j0kNGMMQcIRSJRnjRGKxOK2cxI-nc1jsVjc1jOl2p11ppEwxkImDYEDoJvwZpG+BIYDIZB0ZDBAwhdrGiGsU0Rtk1fmWtiOU2WU2V8VmKmRU2mBN18P8+ppmWNprA5sgdFQuCgZBKxhInHQuFEkDdouGUK9W19ewD0aiIbDyqiJDs-k1jmWThUUQuVJTt2ttqzI4zdrujMedr+JbLEArgzFnsltb9DaDzZ84ZCiCmzhUs2czimPl87j8KlsycNqZI48zlsfk-p9yZLKhc9L5eF4JX1Zrj6G7WIGTZnC2e4IBY7jtio14Io4Pr+BY6LWLesj3i+Y7puaUIkBAuCwNhi7qP+VYSqA4zAfWoGNsGEE7sqKGOJELgWGSfbRnCngYTcWQkVauGThQ6AQDQS4eoBVFSpqeyYtxdiOL6KgWD4ypzIinbOGsB7InM3Z8UaD7CThNoTvhzAumAkkAZRZiyaxniaqh0wQWcyo+s4x6nJ4jg6rGfmUlcmHDqZz7CfhkAGLZFHQjJEweJEARRBYRwxE2EaLO2rikmpGUHkmg53mF5lPnQbRAl8ADK9SxeK8UOeutFgQxoZMVBymsYkUzXmlvX7NGRn3lo9KwFmLTNPUABK5RtN8jT1auCWTDMBkLEsKxrMxTgkNe3j9T6cKGcVoVZKN2TjZa031G0PyNLd1RLdJTWrbM8w+ptqzrJ1UzWJEFjOMSZJnGcFgpFS+A6CI8ADEOxDkQ1NYALS2MqyMRPBWPY9jMHDbciibJWSNrqhVgkAemIUmSoG+tYzGqRTvqxNxFiLOS+N0gyDzMk8UCI8tr26Q41MqH9J6uGSGlIQ4cI+GzJKAwinNpmVFoCy91G7psMQzAe-ohgEZxAyrDpOi6Gv2eMZNHpT5JzM4tPORG+xqgF-onjEmqmwQABu6CiLgEDI9QYBgJbjXjH5R59gejtkj4fhwsq0T4mcfigdYVgqbxp38aQF1XRHNbR3tO4nrq5JJ+pnU7mqfihk4h4Hr6ENJEAA */
    initial: "authenticating",
    context: {
      retryLimit: 5,
      retries: 0,
      synced: false,
      stored: true,
      token: "",
    },
    states: {
      retry: {
        after: {
          retry_delay: {
            target: "authenticating",
            actions: "incrementRetries",
          },
        },
      },
      authenticating: {
        invoke: {
          id: "authenticate",
          src: "authenticate",
        },
        on: {
          AUTHENTICATED: {
            target: "connected",
            actions: "assignTokenToContext",
          },
          AUTHENTICATION_FAILED: [
            {
              target: "retry",
              guard: "shouldRetry",
            },
            { target: "error" },
          ],
        },
      },
      connected: {
        invoke: {
          id: "websocketConnection",
          src: "openWebsocket",
          input: ({ context }) => ({ token: context.token }),
        },
        on: {
          "connection.error": { target: "error" },
          "migration.failed": {
            target: "invalid-tree",
            actions: ["assignValidationError", "markSynced"],
          },
          "connection.authenticationFailed": [
            {
              target: "retry",
              guard: "shouldRetry",
              actions: "resetSynced",
            },
            {
              target: "error",
              guard: "isNotPermitted",
              actions: "assignReason",
            },
          ],
          "connection.disconnected": { target: "paused" },
          "connection.ready": {
            actions: ["resetRetries", "markSynced"],
          },
          CLOSE: { target: "paused" },
        },
      },
      error: {
        type: "final",
      },
      "invalid-tree": {
        type: "final",
      },
      paused: {
        invoke: {
          src: "listenToInteraction",
          id: "listenToInteraction",
        },
        on: {
          INTERACTION: { target: "authenticating" },
          RECONNECT: { target: "authenticating" },
        },
      },
    },
  });
