import { loginAction } from "@mioto/server/actions/login.action";
import { assertEvent, assign, fromCallback, setup } from "xstate";

type LoginFailure = Awaited<ReturnType<typeof loginAction>>["failure"];

type LOGIN_EVENTS =
  | { type: "SUCCESSFULL_VERIFY_LOGIN" }
  | { type: "FAILED_VERIFY_LOGIN"; failure: LoginFailure };

type Events = { type: "VERIFY_LOGIN"; password: string } | LOGIN_EVENTS;

type Context = { failure?: Awaited<ReturnType<typeof loginAction>>["failure"] };

export type onVerify = () => void;

export type onVerifyFailure = (
  failure?: Awaited<ReturnType<typeof loginAction>>["failure"],
) => void;

export const createVerifyLoginMachine = (
  email: string,
  onVerify: onVerify,
  onVerifyFailure?: onVerifyFailure,
) =>
  setup({
    types: {} as {
      events: Events;
      context: Context;
    },
    actions: {
      assignErrorToContext: assign(({ event }) => {
        assertEvent(event, "FAILED_VERIFY_LOGIN");
        return {
          failure: event.failure,
        };
      }),
    },
    actors: {
      verifyLogin: fromCallback<LOGIN_EVENTS, { password: string }>(
        ({ sendBack, input: { password } }) => {
          (async () => {
            const result = await loginAction({ email, password });

            if (!result.success) {
              return sendBack({
                type: "FAILED_VERIFY_LOGIN",
                failure: result.failure,
              });
            }

            sendBack({ type: "SUCCESSFULL_VERIFY_LOGIN" });
          })();
        },
      ),
    },
  }).createMachine({
    initial: "unverified",
    states: {
      unverified: {
        on: {
          VERIFY_LOGIN: "verifingLogin",
        },
      },
      verifingLogin: {
        invoke: {
          src: "verifyLogin",
          input: ({ event }) => {
            assertEvent(event, "VERIFY_LOGIN");
            return { password: event.password };
          },
        },
        on: {
          SUCCESSFULL_VERIFY_LOGIN: {
            target: "verified",
          },
          FAILED_VERIFY_LOGIN: {
            target: "verification_failed",
            actions: "assignErrorToContext",
          },
        },
      },
      verified: { type: "final", entry: () => onVerify() },
      verification_failed: {
        entry: ({ context }) => onVerifyFailure?.(context.failure),
      },
    },
  });
