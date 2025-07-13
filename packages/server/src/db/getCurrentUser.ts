"use server";

import { notFound, redirect } from "next/navigation";
import { checkAuthenticated } from "./checkAuthenticated";

export const getCurrentUser = async (params?: { orgSlug?: string }) => {
  const { user, ...methods } = await checkAuthenticated({
    onUnauthenticated: () => {
      return params?.orgSlug
        ? redirect(`/org/${params.orgSlug}/login`)
        : redirect(`/auth/login`);
    },
  });

  if (!user.Account) return notFound();

  return {
    user: { ...user, Account: user.Account },
    ...methods,
  };
};
