"use server";

import { notFound, redirect } from "next/navigation";
import { checkAuthenticated } from "./checkAuthenticated";

export const getCurrentEmployee = async () => {
  const { user, ...methods } = await checkAuthenticated({
    onUnauthenticated: () => redirect(`/auth/login`),
  });

  if (user.type !== "employee" || !user.Account) return notFound();

  return {
    user: { ...user, Account: user.Account },
    ...methods,
  };
};
