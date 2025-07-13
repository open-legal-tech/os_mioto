"use client";

import { cardClasses } from "@mioto/design-system/Card";
import { Form } from "@mioto/design-system/Form";
import Heading from "@mioto/design-system/Heading";
import { Notification } from "@mioto/design-system/Notification";
import { useTranslations } from "@mioto/locale";
import { changePasswordAction } from "@mioto/server/actions/changePassword.action";
import * as React from "react";
import { VerifiedSettingsChange } from "../[locale]/org/[orgSlug]/(app)/shared/components/VerifiedSettingsChange";
import NewPasswordInput from "./NewPasswordInput";

type Props = { userEmail: string };

export function ChangePassword({ userEmail }: Props) {
  const t = useTranslations();
  const methods = Form.useForm({
    defaultValues: {
      newPassword: "",
    },
  });

  const [isLoading, startTransition] = React.useTransition();

  const [open, setOpen] = React.useState(false);

  return (
    <VerifiedSettingsChange
      email={userEmail}
      onVerify={() => {
        const newPassword = methods.watch("newPassword");

        startTransition(async () => {
          const result = await changePasswordAction({ newPassword });

          if (!result.success) {
            return methods.setError("newPassword", {
              message: t(`components.change-password.errors.weak_password`),
            });
          }

          Notification.add({
            Title: t("components.change-password.notifications.success"),
            variant: "success",
          });
          methods.reset();

          setOpen(false);
        });
      }}
      open={open}
      setOpen={setOpen}
    >
      <div className={cardClasses("flex flex-col gap-2")}>
        <Heading level={3} size="extra-small">
          {t("components.change-password.title")}
        </Heading>
        <Form.Provider methods={methods}>
          <Form.Root onSubmit={methods.handleSubmit(() => setOpen(true))}>
            <NewPasswordInput
              Label={t("components.change-password.inputLabel")}
              name="newPassword"
            />
            <Form.SubmitButton
              isLoading={isLoading}
              className="ml-auto mt-3"
              disabled={!methods.formState.isDirty}
            >
              {t("components.change-password.submit")}
            </Form.SubmitButton>
          </Form.Root>
        </Form.Provider>
      </div>
    </VerifiedSettingsChange>
  );
}
