import { redirect } from "next/navigation";
import { checkAuthenticated } from "../db/checkAuthenticated";

export async function redirectToHome(

  searchParams?: string | URLSearchParams,
): Promise<never> {
  const createPath = (path: string) =>
    searchParams ? `/${path}?${searchParams}` : `/${path}`;

  const auth = await checkAuthenticated({
    onUnauthenticated: () => {
      return redirect(createPath("auth/login"));
    },
  });

  if (auth.user.type === "customer") {
    return auth.redirect(createPath("client"));
  }

  return auth.redirect(createPath("dashboard"));
}
