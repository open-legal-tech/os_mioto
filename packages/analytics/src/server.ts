import "server-only";

import { PostHog } from "posthog-node";
import { analyticsEnv } from "../env";
import type { FeatureFlags } from "./shared";

export const serverAnalytics = () => {
  if (!analyticsEnv.POSTHOG_TOKEN || analyticsEnv.POSTHOG_TOKEN.length === 0) {
    return undefined;
  }

  return new PostHog(analyticsEnv.POSTHOG_TOKEN, {
    host: "https://eu.posthog.com",
    disabled: analyticsEnv.APP_ENV !== "production",
  });
};

export const getFeatureFlag =
  (userUuid: string) => async (flag: FeatureFlags) => {
    if (
      analyticsEnv.APP_ENV === "development" ||
      analyticsEnv.APP_ENV === "testing"
    ) {
      return true;
    }

    if (!serverAnalytics) {
      console.error("Requested feature flag with no posthog integration.");
      return false;
    }

    return !!(await serverAnalytics()?.getFeatureFlag(flag, userUuid));
  };
