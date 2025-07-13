"use client";

import { Button } from "@mioto/design-system/Button";
import Heading from "@mioto/design-system/Heading";
import Link from "@mioto/design-system/Link";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { usePathname, useSearchParams } from "next/navigation";
import { posthog } from "posthog-js";
import { PostHogProvider, usePostHog } from "posthog-js/react";
import * as React from "react";
import PostHogPageView from "./PageView";
import type { FeatureFlags } from "./shared";

export type AnalyticsPopupProps = {
  shouldOptIn?: boolean;
};

export const AnalyticsPopup = ({ shouldOptIn }: AnalyticsPopupProps) => {
  const posthog = usePostHog();
  const [showBanner, setShowBanner] = React.useState(
    !posthog.has_opted_in_capturing() && !posthog.has_opted_out_capturing(),
  );

  const acceptCookies = () => {
    posthog.opt_in_capturing();
    setShowBanner(false);
  };

  const declineCookies = () => {
    posthog.opt_out_capturing();
    setShowBanner(false);
  };

  React.useEffect(() => {
    if (shouldOptIn) {
      posthog.opt_in_capturing();
      setShowBanner(false);
    }
  });

  return showBanner ? (
    <Stack className="absolute bottom-3 left-2 right-2 @md:bottom-5 @md:left-5 @md:right-5 p-2 md:p-4 bg-gray1 z-50 rounded gap-2 shadow-md border border-gray5 max-w-[500px]">
      <Heading size="small">Magst du uns helfen?</Heading>
      <Text>
        Um unsere Angebote weiter zu verbessern, möchten wir besser verstehen,
        wie unsere Software verwendet wird. Dazu würden wir gerne dein
        Nutzerverhalten analysieren und einen Cookie setzen. Mehr Informationen
        findest du hier:{" "}
        <Link href="/privacy" className="py-0">
          Datenschutzerklärung
        </Link>
        . Ist das in Ordnung für dich?
      </Text>
      <Row className="gap-2 mt-2 justify-end">
        <Button variant="tertiary" colorScheme="gray" onClick={declineCookies}>
          Ablehnen
        </Button>
        <Button onClick={acceptCookies}>Zustimmen</Button>
      </Row>
    </Stack>
  ) : null;
};

export default AnalyticsPopup;

export { usePostHog } from "posthog-js/react";

export const useFeatureFlag = (flag: FeatureFlags) => {
  const posthog = usePostHog();

  return !!posthog.getFeatureFlag(flag);
};

export const useGetFeatureFlag = () => {
  const posthog = usePostHog();

  return (flag: FeatureFlags) => !!posthog.getFeatureFlag(flag);
};

export function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Track pageviews
  React.useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = `${url}?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export const PosthogProvider = ({
  children,
  flags,
  userUuid,
  POSTHOG_TOKEN,
}: {
  children: React.ReactNode;
  userUuid?: string;
  flags?: Record<string, any>;
  POSTHOG_TOKEN: string;
}) => {
  if (typeof window !== "undefined") {
    posthog.init(POSTHOG_TOKEN, {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
      mask_all_text: true,
      bootstrap: {
        distinctID: userUuid,
        isIdentifiedID: !!userUuid,
        featureFlagPayloads: flags,
      },
    });
  }

  return (
    <PostHogProvider client={posthog}>
      <React.Suspense>
        <PostHogPageView />
      </React.Suspense>
      {children}
    </PostHogProvider>
  );
};
