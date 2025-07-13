import { getUnauthorizedSession } from "@mioto/server/db/getUnauthorizedSession";
import { type NextRequest, NextResponse } from "next/server";
import validator from "validator";

export async function POST(request: NextRequest) {
  const checkoutId = request.nextUrl.searchParams.get("checkout_id");

  if (!checkoutId) {
    return new Response("Missing checkout_id", { status: 400 });
  }

  const [, sessionUuid] = checkoutId.split("_");

  if (!sessionUuid || !validator.isUUID(sessionUuid)) {
    return new Response("Invalid checkout_id", { status: 400 });
  }

  const session = await getUnauthorizedSession(sessionUuid);

  if (!session) {
    return new Response("Session not found", { status: 400 });
  }

  return NextResponse.redirect(`/org/${session.Owner.Organization.slug}`);
}
