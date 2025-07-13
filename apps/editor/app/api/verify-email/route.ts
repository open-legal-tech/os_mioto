import { Failure } from "@mioto/errors";
import { setTokenCookies } from "@mioto/server/db/checkAuthenticated";
import { verifyEmail } from "@mioto/server/db/verifyEmail";
import { redirect } from "next/navigation";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    console.warn("No token provided");
    return redirect("/?notify=email-verify-invalid-token");
  }

  const authTokens = await verifyEmail({ token });

  if (authTokens instanceof Error) {
    console.warn(authTokens.code);
    return redirect("/?notify=email-verify-invalid-token");
  }

  await setTokenCookies(authTokens);

  redirect(`/org/?notify=email-verified`);
};
