"use client";

import { useOrg } from "@mioto/design-system/Org";
import React from "react";
import { useRouter } from "../../../../../../../../i18n/routing";

export function Session({
  children,
  treeUuid,
  sessionUuid,
}: {
  treeUuid: string;
  children: React.ReactNode;
  sessionUuid: string;
}) {
  const orgSlug = useOrg();
  const router = useRouter();
  const [userUuid, setUserUuid] = React.useState<undefined | string>(undefined);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (userUuid) return;

    const localIds = localStorage.getItem(treeUuid);

    if (localIds) {
      const [localSessionUuid, userUuid] = localIds.split("__");
      if (sessionUuid === localSessionUuid) {
        setUserUuid(userUuid);
      } else {
        router.replace(
          `/org/${orgSlug}/render/${treeUuid}/${localSessionUuid}`,
        );
      }

      return;
    }

    return router.replace(`/org/${orgSlug}/render/${treeUuid}`);
  }, [orgSlug, router, sessionUuid, treeUuid, userUuid]);

  return userUuid ? children : null;
}
