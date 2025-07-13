"use client";

import { usePostHog } from "@mioto/analytics/client";
import { setUser } from "@sentry/nextjs";
import * as React from "react";
import type { APP_ENV } from "@mioto/env/createEnv";

type Props = {
  userUuid: string;
  userEmail: string;
  userOrganizationUuid: string;
  userOrganizationName: string | null;
  APP_ENV: APP_ENV;
};

export function AnalyticsIdentify({
  userEmail,
  userUuid,
  userOrganizationUuid,
  userOrganizationName,
  APP_ENV,
}: Props) {
  const posthog = usePostHog();

  React.useEffect(() => {
    posthog?.identify(userUuid, {
      employee: userEmail.includes("mioto.app"),
      email: userEmail,
      organizationUuid: userOrganizationUuid,
      organizationName: userOrganizationName,
      env: APP_ENV,
    });

    setUser({
      email: userEmail,
      id: userUuid,
    });
  }, [
    posthog,
    userEmail,
    userOrganizationName,
    userOrganizationUuid,
    userUuid,
  ]);

  return null;
}
