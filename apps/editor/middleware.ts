
import createMiddleware from "@mioto/locale/middleware";
import { verifyAccessToken } from "@mioto/server/Token/subModels/AccessToken/verify";
import { type NextMiddleware, NextResponse } from "next/server";
import { locales } from "./app/shared/locales";
import builderEnv from "./env";

function extractOrgSegment(url: string) {
  const orgSegment = "/org/";
  if (url.includes(orgSegment)) {
    const parts = url.split(orgSegment);
    const segments = parts[1]?.split("/");

    if (segments) {
      const orgSlug = segments[0];
      const path = segments[1];

      if (!orgSlug || !path) return null;

      return { orgSlug, path };
    }
  }

  return null; // or any other appropriate value to indicate extraction failure
}

export const middleware: NextMiddleware = async (request) => {
  const redirectUrl = builderEnv.REDIRECTS?.[request.nextUrl.pathname];
  if (redirectUrl) {
    return NextResponse.redirect(redirectUrl);
  }
  const pathname = request.nextUrl.pathname;
  const segments = extractOrgSegment(request.nextUrl.pathname);
  if (segments) {
    const token = request.cookies.get("token")?.value;
    if (token) {
      const verifiedAccessToken = await verifyAccessToken({ token });
      if (verifiedAccessToken instanceof Error) {
        request.nextUrl.pathname = "/auth/login";
      } else if (
        verifiedAccessToken.orgSlug &&
        verifiedAccessToken.orgSlug !== segments.orgSlug
      ) {
        request.nextUrl.pathname = request.nextUrl.pathname.replace(
          `/org/${segments.orgSlug}`,
          `/org/${verifiedAccessToken.orgSlug}`,
        );
      }
    }
  }

  const response = createMiddleware({
    locales,
    defaultLocale: "de",
    localePrefix: "always",
  })(request);

  if (!response.redirected && pathname !== request.nextUrl.pathname) {
    return NextResponse.redirect(request.nextUrl);
  }
  return response;
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|ingest|public|render).*)",
  ],
};
