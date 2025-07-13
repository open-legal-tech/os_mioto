"use client";
import { cardClasses } from "@mioto/design-system/Card";
import { Form } from "@mioto/design-system/Form";
import Heading from "@mioto/design-system/Heading";
import { Notification } from "@mioto/design-system/Notification";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import { changeEmailAction } from "@mioto/server/actions/changeEmail.action";
import * as React from "react";
import { VerifiedSettingsChange } from "../[locale]/org/[orgSlug]/(app)/shared/components/VerifiedSettingsChange";
import { EmailField } from "./EmailInput";
import { useRouter } from "../../i18n/routing";

type Props = { userEmail: string };

export function ChangeEmail({ userEmail }: Props) {
  const t = useTranslations();
  const methods = Form.useForm<{ email: string }>({
    defaultValues: {
      email: "",
    },
  });
  const { refresh } = useRouter();

  const [isLoading, startTransition] = React.useTransition();

  const [open, setOpen] = React.useState(false);

  return (
    <VerifiedSettingsChange
      email={userEmail}
      onVerify={() => {
        const email = methods.getValues("email");

        startTransition(async () => {
          const result = await changeEmailAction({ newEmail: email });

          if (!result.success) {
            methods.setError("email", {
              message: t(`components.change-email.errors.email_already_used`),
            });
          } else {
            Notification.add({
              Title: t("components.change-email.notifications.success.title"),
              variant: "success",
            });
          }

          setOpen(false);
          refresh();
        });
      }}
      open={open}
      setOpen={setOpen}
    >
      <div className={cardClasses("flex flex-col gap-2")}>
        <Stack className="gap-1">
          <Heading level={3} size="extra-small">
            {t("components.change-email.title")}
          </Heading>
          <Text className="text-gray9 ">
            {t.rich("components.change-email.description", {
              userEmail,
            })}
          </Text>
        </Stack>
        <Form.Provider methods={methods}>
          <Form.Root onSubmit={methods.handleSubmit(() => setOpen(true))}>
            <EmailField Label={t("components.change-email.label")} />
            <Form.SubmitButton
              isLoading={isLoading}
              className="ml-auto mt-3"
              disabled={!methods.formState.isDirty}
            >
              {t("components.change-email.submit")}
            </Form.SubmitButton>
          </Form.Root>
        </Form.Provider>
      </div>
    </VerifiedSettingsChange>
  );
}
