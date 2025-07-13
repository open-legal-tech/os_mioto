"use server";

import { Failure } from "@mioto/errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkAuthenticated,
  removeTokenCookies,
} from "../db/checkAuthenticated";
import { verifyRefreshToken } from "../models/Token/subModels/RefreshToken/verify";
import { findToken } from "../models/Token/find";

export async function logoutAction() {
  const { db } = await checkAuthenticated({
    onUnauthenticated: () => redirect("/auth/login"),
  });
  const refreshToken = (await cookies()).get("refreshToken")?.value;

  if (!refreshToken) {
    throw new Error("Missing refreshToken on logout");
  }

  const refreshTokenPayload = await verifyRefreshToken(db)({
    token: refreshToken,
  });

  if (refreshTokenPayload instanceof Error) return { success: true };

  const refreshTokenFromDb = await findToken(db)({
    userUuid: refreshTokenPayload.payload.userUuid,
    token: refreshToken,
    type: "REFRESH",
    blacklisted: false,
  });

  if (refreshTokenFromDb instanceof Failure) return refreshTokenFromDb;

  await db.token.delete({
    where: {
      id: refreshTokenFromDb.id,
    },
  });

  await removeTokenCookies();

  return redirect(`/auth/login`);
}
