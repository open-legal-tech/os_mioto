"use server";

import { notFound, redirect } from "next/navigation";
import { checkAuthenticated } from "./checkAuthenticated";

export const getCurrentCustomer = async (params: { orgSlug: string }) => {
  const { user, ...methods } = await checkAuthenticated({
    onUnauthenticated: () => redirect(`/org/${params.orgSlug}/login`),
  });

  if (user.type !== "customer" || !user.Account) return notFound();

  return {
    user: { ...user, Account: user.Account },
    ...methods,
  };
};
