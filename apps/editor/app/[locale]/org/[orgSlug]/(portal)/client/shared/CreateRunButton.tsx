"use client";

import { Button, type ButtonProps } from "@mioto/design-system/Button";
import { Notification } from "@mioto/design-system/Notification";
import { useOrg } from "@mioto/design-system/Org";
import { useTranslations } from "@mioto/locale";
import { createCustomerSessionAction } from "./createClientSession.action";

type Props = {
  snapshotUuid: string;
  treeUuid: string;
  treeName: string;
  numberOfExistingSessions: number;
  allowedNumberOfSessions?: number;
} & ButtonProps;

export function CreateRunButton({
  snapshotUuid,
  numberOfExistingSessions,
  allowedNumberOfSessions,
  treeUuid,
  treeName,
  ...props
}: Props) {
  const orgSlug = useOrg();
  const t = useTranslations();

  return (
    <Button
      onAsyncClick={async () => {
        const result = await createCustomerSessionAction({
          snapshotUuid,
          name: `${new Date().toLocaleDateString()} ${treeName}`,
          treeUuid,
          orgSlug,
        });

        if (!result.success) {
          Notification.add({
            Title: t("client-portal.start-session.error.title"),
            Content: t("client-portal.start-session.error.content"),
          });
        }
      }}
      disabled={
        numberOfExistingSessions >=
        (allowedNumberOfSessions ?? Number.POSITIVE_INFINITY)
      }
      {...props}
    >
      {t("client-portal.start-session.label")}
    </Button>
  );
}
