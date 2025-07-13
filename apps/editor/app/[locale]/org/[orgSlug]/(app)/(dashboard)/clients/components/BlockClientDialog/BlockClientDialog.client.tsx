"use client";
import { Button } from "@mioto/design-system/Button";
import { DialogDefault } from "@mioto/design-system/Dialog";
import { Notification } from "@mioto/design-system/Notification";
import { useTranslations } from "@mioto/locale";
import { changeUserBlockedAction } from "@mioto/server/actions/blockCustomer.action";

export type BlockClientDialogProps = {
  customerUuid: string;
  customerName: string;
  isBlocked: boolean;
};

export function BlockClientDialogClient({
  customerUuid,
  customerName,
  isBlocked,
}: BlockClientDialogProps) {
  const t = useTranslations();

  return (
    <DialogDefault
      title={
        isBlocked
          ? t("app.client.block-client.dialog.unblock.title")
          : t("app.client.block-client.dialog.block.title")
      }
      description={
        isBlocked
          ? t("app.client.block-client.dialog.unblock.description", {
              customerName,
            })
          : t("app.client.block-client.dialog.block.description", {
              customerName,
            })
      }
      ConfirmationButton={
        <Button
          onAsyncClick={async () => {
            await changeUserBlockedAction({
              customerUuid,
              isBlocked: !isBlocked,
            });

            if (isBlocked) {
              Notification.add({
                Title: t(
                  "app.client.block-client.dialog.unblock.notification.success.title",
                ),
                Content: t(
                  "app.client.block-client.dialog.unblock.notification.success.content",
                  { customerName },
                ),
                variant: "success",
              });
            } else {
              Notification.add({
                Title: t(
                  "app.client.block-client.dialog.block.notification.success.title",
                ),
                Content: t(
                  "app.client.block-client.dialog.block.notification.success.content",
                  { customerName },
                ),
                variant: "success",
              });
            }
          }}
        >
          {isBlocked
            ? t("app.client.block-client.dialog.unblock.submit", {
                customerName,
              })
            : t("app.client.block-client.dialog.block.submit", {
                customerName,
              })}
        </Button>
      }
    />
  );
}
