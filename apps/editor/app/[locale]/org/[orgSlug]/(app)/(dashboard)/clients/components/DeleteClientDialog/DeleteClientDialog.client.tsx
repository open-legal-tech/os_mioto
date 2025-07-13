"use client";
import { Button } from "@mioto/design-system/Button";
import { DialogDefault } from "@mioto/design-system/Dialog";
import { Notification } from "@mioto/design-system/Notification";
import { useTranslations } from "@mioto/locale";
import { deleteCustomerAction } from "@mioto/server/actions/deleteCustomer.action";

export type DeleteClientDialogProps = {
  customerUuid: string;
  customerName: string;
};

export function DeleteClientDialogClient({
  customerUuid,
  customerName,
}: DeleteClientDialogProps) {
  const t = useTranslations();

  return (
    <DialogDefault
      title={t("app.client.delete-client.dialog.title")}
      description={t("app.client.delete-client.dialog.description", {
        customerName: customerName.trim(),
      })}
      ConfirmationButton={
        <Button
          onAsyncClick={async () => {
            await deleteCustomerAction({
              customerUuid,
            });

            Notification.add({
              Title: t(
                "app.client.delete-client.dialog.notification.success.title",
              ),
              Content: t(
                "app.client.delete-client.dialog.notification.success.content",
                { customerName },
              ),
              variant: "success",
            });
          }}
        >
          {t("app.client.delete-client.dialog.submit", {
            customerName,
          })}
        </Button>
      }
    />
  );
}
