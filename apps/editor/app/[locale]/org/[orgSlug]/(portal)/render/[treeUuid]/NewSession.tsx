"use client";

import { usePostHog } from "posthog-js/react";
import React from "react";
import { useRouter } from "../../../../../../../i18n/routing";

export function NewSession({
  orgSlug,
  sessionUuid,
  treeUuid,
  treeName,
  userUuid,
}: {
  orgSlug: string;
  sessionUuid: string;
  treeUuid: string;
  userUuid: string;
  treeName: string;
}) {
  const router = useRouter();
  const posthog = usePostHog();

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(treeUuid, `${sessionUuid}__${userUuid}`);
    router.replace(`/org/${orgSlug}/render/${treeUuid}/${sessionUuid}`);
    posthog.capture("New Session", {
      treeName,
    });
  }, [
    orgSlug,
    router,
    router.replace,
    sessionUuid,
    treeUuid,
    userUuid,
    posthog,
    treeName,
  ]);

  return null;
}
