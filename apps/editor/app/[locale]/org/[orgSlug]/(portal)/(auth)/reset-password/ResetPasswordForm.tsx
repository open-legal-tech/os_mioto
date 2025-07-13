"use client";

import { Form } from "@mioto/design-system/Form";
import { Notification } from "@mioto/design-system/Notification";
import { Stack } from "@mioto/design-system/Stack";
import { resetPasswordAction } from "@mioto/server/db/resetPassword.action";
import { useTranslations } from "next-intl";
import NewPasswordInput from "../../../../../../shared/NewPasswordInput";
import { PasswordInput } from "../../../../../../shared/PasswordInput";
import { useRouter } from "../../../../../../../i18n/routing";

type Props = { token: string };

export function ResetPasswordForm({ token }: Props) {
  const t = useTranslations("auth.resetPassword");

  const methods = Form.useForm({
    defaultValues: {
      newPassword: "",
      repeatedNewPassword: "",
    },
  });
  const router = useRouter();

  return (
    <Form.Provider methods={methods}>
      <Form.Root
        onSubmit={methods.handleAsyncSubmit(async (values) => {
          const result = await resetPasswordAction({
            password: values.newPassword,
            token,
          });

          if (!result.success) {
            Notification.add({
              Title: t("errors.unknown.notification.title"),
              Content: t("errors.unknown.notification.content"),
              variant: "danger",
            });
          }

          Notification.add({
            Title: t("success.notification.title"),
            variant: "success",
          });
        })}
      >
        <Stack className="gap-4">
          <NewPasswordInput
            {...methods.register("newPassword", { required: true })}
          />
          <PasswordInput
            {...methods.register("repeatedNewPassword", {
              required: true,
              validate: (value) =>
                value === methods.getValues("newPassword") ||
                t("form.password.errors.no-match.message"),
            })}
            Label={t("form.password.label")}
          />
        </Stack>
        <Form.SubmitButton type="submit" className="mt-6">
          {t("form.submit")}
        </Form.SubmitButton>
      </Form.Root>
    </Form.Provider>
  );
}
