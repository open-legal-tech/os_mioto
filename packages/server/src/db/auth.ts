import { Failure } from "@mioto/errors";
import { cookies } from "next/headers.js";
import type { DB } from "./types";
import { generateAuthTokens } from "../models/Auth/generateAuthTokens";
import { verifyRefreshToken } from "../models/Token/subModels/RefreshToken/verify";
import serverModelsEnv from "../../env";

export const authCookieConfig = {
  // Safari does not set a secure cookie if the connection is over http. Which it is in development.
  secure: serverModelsEnv.APP_ENV === "production",
  httpOnly: true,
  path: "/",
} as const;

export const tokenCookieMaxAge = (expires?: number) =>
  expires
    ? { expires: new Date(expires * 1000) }
    : {
        maxAge: Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES ?? 15) * 60,
      };

export const refreshCookieMaxAge = (expires?: number) =>
  expires
    ? { expires: new Date(expires * 1000) }
    : {
        maxAge: Number(process.env.JWT_REFRESH_EXPIRATION_DAYS ?? 7) * 86400,
      };

export const getAuthTokens = (db: DB) => async (userUuid: string) => {
  const user = await db.user.findUnique({
    where: { uuid: userUuid },
    include: {
      Tokens: {
        where: {
          type: "REFRESH",
        },
        orderBy: {
          expires: "desc",
        },
      },
      Organization: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!user)
    return new Failure({
      code: "user_not_found",
    });

  return await generateAuthTokens(db)(user.uuid, user.Organization.slug);
};

export const getFreshTokens = async (db: DB) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const refreshToken = cookieStore.get("refreshToken");

  // When the token is still valid we don't need to refresh it and just return it
  if (token) {
    return { token: token.value, refreshToken: refreshToken?.value as string };
  }

  // When there is a valid refreshToken we can use it to refresh the token

  if (refreshToken) {
    const tokenPayload = await verifyRefreshToken(db)({
      token: refreshToken.value,
    });

    if (tokenPayload instanceof Error) return tokenPayload;

    return await getAuthTokens(db)(tokenPayload.payload.userUuid);
  }

  return new Failure({
    code: "unauthenticated",
  });
};
