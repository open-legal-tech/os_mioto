import { Failure } from "@mioto/errors";
import prisma from "@mioto/prisma";
import { enhance } from "@zenstackhq/runtime";
import {
  revalidatePath as nextRevalidatePath,
  revalidateTag as nextRevalidateTag,
} from "next/cache.js";
import { redirect as nextRedirect, notFound } from "next/navigation";
import { cache } from "react";
import { assign, createActor, fromPromise, setup } from "xstate";
import {
  authCookieConfig,
  refreshCookieMaxAge,
  tokenCookieMaxAge,
} from "./auth";
import { cookies } from "next/headers";
import { createAccessToken } from "../models/Token/subModels/AccessToken/create";
import { verifyAccessToken } from "../models/Token/subModels/AccessToken/verify";
import { createRefreshToken } from "../models/Token/subModels/RefreshToken/create";
import { verifyRefreshToken } from "../models/Token/subModels/RefreshToken/verify";

export async function setTokenCookies({
  access,
  refresh,
}: Exclude<Awaited<ReturnType<typeof refreshTokens>>, Failure>) {
  (await cookies()).set("token", access.token, {
    ...authCookieConfig,
    ...tokenCookieMaxAge(access.expires),
  });

  (await cookies()).set("refreshToken", refresh.token, {
    ...authCookieConfig,
    ...refreshCookieMaxAge(refresh.expires),
  });
}

export async function removeTokenCookies() {
  (await cookies()).delete("token");
  (await cookies()).delete("refreshToken");
}

const refreshTokens = async ({
  userUuid,
  orgSlug,
}: {
  userUuid: string;
  orgSlug: string;
}) => ({
  access: await createAccessToken({ userUuid: userUuid, orgSlug }),
  refresh: await createRefreshToken(prisma)({
    orgSlug,
    userUuid: userUuid,
  }),
});

const getUser = async (userUuid: string) => {
  const user = await cache(
    async () =>
      await prisma.user.findUnique({
        where: { uuid: userUuid },
        include: {
          Organization: { include: { Theme: true, ClientPortal: true } },
          Customer: true,
          Employee: true,
          Account: {
            select: {
              email: true,
              privacyVersion: true,
              emailIsVerified: true,
              termsVersion: true,
            },
          },
        },
      }),
  )();

  if (!user) {
    throw new Error("user not found");
  }

  const db = enhance(prisma, { user }, { logPrismaQuery: true });
  const revalidatePath = (
    path: string,
    type?: Parameters<typeof nextRevalidatePath>[1],
  ) => {
    if (!path.startsWith("/")) throw new Error("path must start with /");
    nextRevalidatePath(
      `/[locale]/org/${user.Organization.slug}${path}`,
      type ?? "page",
    );
  };

  const revalidateTag = (tag: string) =>
    nextRevalidateTag(`${user.Organization.uuid}-${tag}`);

  const redirect = (path: string) => {
    if (!path.startsWith("/")) throw new Error("path must start with /");

    nextRedirect(`/org/${user.Organization.slug}${path}`);
  };

  switch (true) {
    case user.Employee != null:
      return {
        user: {
          ...user,
          type: "employee",
        },
        db,
        revalidatePath,
        revalidateTag,
        redirect,
      } as const;

    case user.Customer !== null:
      return {
        user: {
          ...user,
          type: "customer",
        },
        db,
        revalidatePath,
        revalidateTag,
        redirect,
      } as const;

    default: {
      throw new Error(`user not of type customer or employee`);
    }
  }
};

type Auth = Awaited<ReturnType<typeof getUser>> & { token: string };

export const machine = ({
  token,
  refreshToken,
}: {
  token?: string;
  refreshToken: string;
}) =>
  setup({
    types: {} as {
      context: {
        user?: Auth;
        error?: string;
      };
      output: Auth | "unauthenticated";
    },
    actors: {
      onUnauthenticated: fromPromise(async () => {
        try {
          await removeTokenCookies();
        } catch (e) {
          console.log(e);
        }
      }),
      getRefreshToken: fromPromise(async () => {
        if (!refreshToken) return;

        const verifiedRefreshToken = await verifyRefreshToken(prisma)({
          token: refreshToken,
        });

        if (verifiedRefreshToken instanceof Error) {
          throw verifiedRefreshToken;
        }

        let orgSlug = verifiedRefreshToken.payload.orgSlug;
        if (!orgSlug) {
          orgSlug = (
            await prisma.user.findUnique({
              where: {
                uuid: verifiedRefreshToken.payload.userUuid,
              },
              select: {
                Organization: {
                  select: {
                    slug: true,
                  },
                },
              },
            })
          )?.Organization.slug;
        }

        if (!orgSlug) {
          throw new Error("Org slug not found");
        }

        return { user: await getUser(verifiedRefreshToken.payload.userUuid) };
      }),
      getAccessToken: fromPromise(async () => {
        if (!token) return;

        const verifiedAccessToken = await verifyAccessToken({ token });

        if (verifiedAccessToken instanceof Error) {
          throw verifiedAccessToken;
        }

        return { user: await getUser(verifiedAccessToken.userUuid) };
      }),
    },
    actions: {
      assignError: assign({
        error: ({ event }) => event.error,
      }),
    },
    guards: {},
    delays: {},
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QGEAWYDGBrABAQQFcAXVAOgFUA7LSgewHdKBiCWysUgS0oDdasOMIngwY4sACr8wlANoAGALqJQAB1qxORTmxUgAHogDsRgIykATADYAHAFYAzA6MPT8+UYsAaEAE9EALR2RqQALFbuRnZW1gCcoaamsQC+yT5omLiEJBTUdIwsbBzcfAKkQiJisJLScqbKSCDqmtq6jYYIUSFJ8qEW-Z72rj7+CAE9pGah8aZmDrEW4Uap6ejY+MRkleI4AKL6qpwATpCF7Fy80uVgRABKYABmJ7CoUgJySnrNWjqUeh2JeQOUhuCyxKyhGyxeT9CxGEaIRY2MKmBxwxw2Cw2IxWFYgDLrbJbUQ7faHE4QM7FS5lIT3J5wV61WT1L4aH5tUAA+RQ0gwyGOUJo+S2OwIhB9Uh2Uyiiyohw2Zw2VJpEB0CBwPQErKbNktX7-RBo5ERWzoqzzIGhULigJw5Fy6Z2JYeBy41XajY5Kg0Bh-RrfVr+rlGnGkU2YqIW6EOa22i0gxXucKhMxWaLu1aZL1bTYybQYACGREgeo5wYMiFM-Vi4fm82dQPmYNtpkhpAWOP6Vh7MpsmLxnqJuULecoBeLpYD7KDhoQiUcljcFqSFlcMXFCuR81iCscFjssVmB8Hax1OW21T2B2OU7UM4N7UQ6fkpBs7l6wR7Rl63j8RvfcNVwtLEUwWd1UiAA */
    id: "Check Auth",
    initial: "Unknown",
    output: ({ context }) => {
      if (!context.user) return "unauthenticated";

      return context.user;
    },
    states: {
      Unknown: {
        invoke: {
          src: "getAccessToken",
          id: "getAccessToken",
          onDone: [
            {
              target: "Access Expired",
              guard: ({ event }) => !event.output?.user,
            },
            { target: "Authenticated" },
          ],
          onError: {
            target: "Unauthenticated",
            actions: ["assignError"],
          },
        },
      },
      Authenticated: {
        entry: assign({ user: ({ event }) => event.output.user }),
        type: "final",
      },
      Unauthenticated: {
        invoke: { src: "onUnauthenticated", id: "onUnauthenticated" },
        type: "final",
      },
      "Access Expired": {
        invoke: {
          src: "getRefreshToken",
          id: "getRefreshToken",
          onDone: [
            {
              target: "Unauthenticated",
              guard: ({ event }) => !event.output?.user,
            },
            { target: "Authenticated" },
          ],
          onError: {
            target: "Unauthenticated",
            actions: ["assignError"],
          },
        },
      },
    },
  });

export async function checkAuthenticated<TReturn>(config: {
  onError?: (error: unknown) => void;
  onUnauthenticated: () => TReturn;
}): Promise<Auth | TReturn>;
export async function checkAuthenticated(config?: {
  onError?: (error: unknown) => void;
}): Promise<"unauthenticated" | Auth>;
export async function checkAuthenticated<TReturn>(config?: {
  onError?: (error: unknown) => void;
  onUnauthenticated?: () => TReturn;
}): Promise<"unauthenticated" | Auth | TReturn> {
  let token = (await cookies()).get("token")?.value;
  const refreshToken = (await cookies()).get("refreshToken")?.value;

  if (!refreshToken) return config?.onUnauthenticated?.() ?? "unauthenticated";

  try {
    return await new Promise<{
      status: "authenticated";
      data: Auth;
    }>((resolve, reject) => {
      const authState = createActor(machine({ token, refreshToken }));

      authState.start();

      authState.subscribe(({ value, status, output, context }) => {
        if (value === "Unauthenticated" || output === "unauthenticated") {
          reject({ status: "unauthenticated", data: context.error });
        } else if (value === "Authenticated" && status === "done") {
          resolve({ status: "authenticated", data: output });
        }
      });

      authState.subscribe({
        error: (error) => {
          console.error(error);
          return config?.onError?.(error);
        },
      });
    }).then(async (value) => {
      const refreshedTokens = await refreshTokens({
        userUuid: value.data.user.uuid,
        orgSlug: value.data.user.Organization.slug,
      });

      token = refreshedTokens.access.token;

      // This try catch is necessary, because next js is throwing when cookies are
      // modified outside of a route handler or server action. Since this function
      // is also used in Server Components we need to catch this error.
      try {
        await setTokenCookies(refreshedTokens);
      } catch {}
      return { ...value.data, token } as Auth;
    });
  } catch (error) {
    console.log(error);
    try {
      removeTokenCookies();
    } catch {}

    return config?.onUnauthenticated?.() ?? "unauthenticated";
  }
}

async function checkAnonymusUser(userUuid: string) {
  const user = await prisma.user.findUnique({
    where: { uuid: userUuid },
    include: {
      Organization: { include: { Theme: true, ClientPortal: true } },
      Customer: true,
      Employee: true,
      Account: {
        select: {
          email: true,
          privacyVersion: true,
          emailIsVerified: true,
          termsVersion: true,
        },
      },
    },
  });

  if (!user) notFound();

  const db = enhance(prisma, { user }, { logPrismaQuery: true });
  const revalidatePath = (path: string) => {
    if (!path.startsWith("/")) throw new Error("path must start with /");
    nextRevalidatePath(`/org/${user.Organization.slug}${path}`);
  };

  const revalidateTag = (tag: string) =>
    nextRevalidateTag(`${user.Organization.uuid}-${tag}`);

  const redirect = (path: string) => {
    if (!path.startsWith("/")) throw new Error("path must start with /");

    nextRedirect(`/org/${user.Organization.slug}${path}`);
  };

  return {
    user: {
      ...user,
      type: "anonymusUser",
    },
    db,
    revalidatePath,
    revalidateTag,
    redirect,
  } as const;
}

export async function checkAuthWithAnonymus(userUuid: string) {
  return await checkAuthenticated({
    onUnauthenticated: async () => {
      const result = await checkAnonymusUser(userUuid);

      if (result instanceof Failure) return notFound();

      return { ...result, token: undefined };
    },
  });
}
