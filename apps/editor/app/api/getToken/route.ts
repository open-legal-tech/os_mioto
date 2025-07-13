import { Failure } from "@mioto/errors";
import { checkAuthenticated } from "@mioto/server/db/checkAuthenticated";
import { cookies } from "next/headers";

export const GET = async () => {
  const user = await checkAuthenticated();

  const token = (await cookies()).get("token")?.value;

  if (user instanceof Failure)
    return new Response(JSON.stringify(user.body()), { status: 401 });

  return new Response(JSON.stringify({ token }));
};
