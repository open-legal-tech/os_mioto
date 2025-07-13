"use server";

import { Failure } from "@mioto/errors";
import { cookies } from "next/headers.js";
import { checkAuthenticated } from "../db/checkAuthenticated";

export async function getTokenAction() {
  const user = await checkAuthenticated({});

  if (user instanceof Failure) {
    return { success: false, failure: user.body() } as const;
  }

  const token = (await cookies()).get("token")?.value;
  if (!token)
    throw new Error(
      "The token has just been refreshed but could not be found.",
    );

  return {
    success: true,
    data: {
      token,
    },
  } as const;
}
