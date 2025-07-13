"use client";

import { VisuallyHidden } from "@ariakit/react/visually-hidden";
import { Button } from "@mioto/design-system/Button";
import {
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@mioto/design-system/Dialog";
import { Form } from "@mioto/design-system/Form";
import { Notification } from "@mioto/design-system/Notification";
import { useTranslations } from "@mioto/locale";
import { createCustomerAction } from "@mioto/server/actions/createCustomer.action";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { pickBy } from "remeda";
import { NewCustomerForm, type NewCustomerFormData } from "./NewCustomerForm";

export function NewCustomerDialog({
  withPortalAccess = false,
}: {
  withPortalAccess?: boolean;
}) {
  const methods = Form.useForm<NewCustomerFormData>({
    defaultValues: {
      portalAccess: withPortalAccess,
      sendEmail: withPortalAccess,
    },
  });

  const [open, setOpen] = React.useState(false);
  const t = useTranslations();

  return (
    <DialogRoot
      open={open}
      onOpenChange={(open) => {
        if (!open) methods.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus />
          {t("app.client.new-client.label")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("app.client.new-client.dialog.title")}</DialogTitle>
        </DialogHeader>
        <VisuallyHidden>
          {t("app.client.new-client.dialog.description")}
        </VisuallyHidden>
        <NewCustomerForm
          methods={methods}
          onSubmit={(event) => {
            methods.setFocus("firstname", { shouldSelect: true });

            return methods.handleAsyncSubmit(async (values) => {
              const isSaveEvent =
                event.nativeEvent instanceof SubmitEvent &&
                event.nativeEvent.submitter instanceof HTMLButtonElement
                  ? event.nativeEvent.submitter?.name === "save"
                  : false;

              const result = await createCustomerAction(values);

              if (!result.success) {
                return Notification.add({
                  Title: t(
                    "app.client.new-client.notification.e-mail_taken.title",
                  ),
                  Content: t(
                    "app.client.new-client.notification.e-mail_taken.content",
                  ),
                  variant: "danger",
                });
              }

              if (!values.portalAccess) {
                Notification.add({
                  Title: t(
                    "app.client.new-client.dialog.notification.success-without-portal.title",
                  ),
                  Content: t(
                    "app.client.new-client.dialog.notification.success-without-portal.content",
                    {
                      name:
                        values.firstname && values.lastname
                          ? `${values.firstname} ${values.lastname}`
                          : values.email,
                    },
                  ),
                  variant: "success",
                });
              } else {
                if (!values.sendEmail) {
                  navigator.clipboard.writeText(result.data.inviteLink);

                  Notification.add({
                    Title: t(
                      "app.client.new-client.dialog.notification.success-with-portal.title",
                    ),
                    Content: t(
                      "app.client.new-client.dialog.notification.success-with-portal.content",
                      {
                        name:
                          values.firstname && values.lastname
                            ? `${values.firstname} ${values.lastname}`
                            : values.email,
                      },
                    ),
                    variant: "success",
                  });
                } else {
                  Notification.add({
                    Title: t(
                      "app.client.new-client.dialog.notification.success-with-portal.title",
                    ),
                    Content: t(
                      "app.client.new-client.dialog.notification.success-with-portal-with-email.content",
                      {
                        name:
                          values.firstname && values.lastname
                            ? `${values.firstname} ${values.lastname}`
                            : values.email,
                      },
                    ),
                    variant: "success",
                  });
                }
              }

              methods.reset();
              if (isSaveEvent) setOpen(false);
            })(event);
          }}
        />
      </DialogContent>
    </DialogRoot>
  );
}
