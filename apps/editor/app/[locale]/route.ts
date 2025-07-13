
import { redirectToHome } from "@mioto/server/redirects/redirectToHome";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return redirectToHome(request.nextUrl.searchParams);
}
