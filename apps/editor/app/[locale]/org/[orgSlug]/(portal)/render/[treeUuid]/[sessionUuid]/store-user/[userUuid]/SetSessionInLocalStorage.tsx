"use client";


import React from "react";
import { useRouter } from "../../../../../../../../../../i18n/routing";

export function SetSessionInLocalStorage({
  orgSlug,
  treeUuid,
  sessionUuid,
  userUuid,
}: {
  orgSlug: string;
  treeUuid: string;
  sessionUuid: string;
  userUuid: string;
}) {
  const router = useRouter();

  React.useEffect(() => {
    localStorage.setItem(treeUuid, `${sessionUuid}__${userUuid}`);
    router.replace(`/org/${orgSlug}/render/${treeUuid}/${sessionUuid}`);
  }, [orgSlug, router, router.replace, sessionUuid, treeUuid, userUuid]);

  return null;
}
