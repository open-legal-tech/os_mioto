"use client";

import { PosthogProvider } from "@mioto/analytics/client";
import { useSearchParams } from "next/navigation";

export default function OrgAnalyticsProvider({
  analyticsKey,
  children,
}: {
  analyticsKey: string;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  const noTracking = searchParams.get("no-tracking");

  if (noTracking) return children;

  return (
    <PosthogProvider POSTHOG_TOKEN={analyticsKey}>{children}</PosthogProvider>
  );
}
