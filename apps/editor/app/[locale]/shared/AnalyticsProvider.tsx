import {
  type AnalyticsPopupProps,
  PosthogProvider,
} from "@mioto/analytics/client";
import { serverAnalytics } from "@mioto/analytics/server";
import { checkAuthenticated } from "@mioto/server/db/checkAuthenticated";
import type React from "react";
import { builderEnv } from "../../../env";
import { AnalyticsIdentify } from "../../shared/AnalyticsIdentify";
import { AnalyticsPopup } from "./AnalyticsPopup";

export async function AnalyticsProvider({
  children,
  withPopoup = true,
}: {
  children: React.ReactNode;
  withPopoup?: boolean;
  popupProps?: AnalyticsPopupProps;
}) {
  if (!builderEnv.POSTHOG_TOKEN || builderEnv.POSTHOG_TOKEN.length === 0) {
    return children;
  }

  const auth = await checkAuthenticated();

  let flags: Record<string, string | boolean> | undefined;
  let userUuid: string | undefined;
  if (auth !== "unauthenticated" && auth.user.Account) {
    serverAnalytics()?.identify({
      distinctId: auth.user.uuid,
      properties: {
        employee: auth.user.Account.email.includes("mioto.app"),
        email: auth.user.Account.email,
        organizationUuid: auth.user.organizationUuid,
        organizationName: auth.user.Organization.name,
        organizationSlug: auth.user.Organization.slug,
        env: builderEnv.APP_ENV,
      },
    });

    flags = await serverAnalytics()?.getAllFlags(auth.user.uuid);
    userUuid = auth.user.uuid;
  }

  return (
    <PosthogProvider
      flags={flags}
      userUuid={userUuid}
      POSTHOG_TOKEN={builderEnv.POSTHOG_TOKEN}
    >
      {withPopoup ? <AnalyticsPopup shouldOptIn /> : null}
      {auth !== "unauthenticated" && auth.user.Account?.email ? (
        <AnalyticsIdentify
          userEmail={auth.user.Account.email}
          userUuid={auth.user.uuid}
          userOrganizationUuid={auth.user.organizationUuid}
          userOrganizationName={auth.user.Organization.name}
          APP_ENV={builderEnv.APP_ENV}
        />
      ) : null}
      {children}
    </PosthogProvider>
  );
}
