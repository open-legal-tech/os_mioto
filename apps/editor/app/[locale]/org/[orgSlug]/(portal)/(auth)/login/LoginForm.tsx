"use client";

import { ErrorMessage } from "@hookform/error-message";
import { usePostHog } from "@mioto/analytics/client";
import { Form } from "@mioto/design-system/Form";
import Link from "@mioto/design-system/Link";
import { Message } from "@mioto/design-system/Message";
import { useOrg } from "@mioto/design-system/Org";
import { useTranslations } from "@mioto/locale";
import { EmailField } from "../../../../../../shared/EmailInput";
import { PasswordInput } from "../../../../../../shared/PasswordInput";
import { clientLoginAction } from "./clientLogin.action";
import { useRouter } from "../../../../../../../i18n/routing";

const LabelWithForgotPasswordLink = (props: Form.FieldTopRightProps) => {
  const t = useTranslations();

  return (
    <Link href="/auth/forgot-password" size="small" {...props}>
      {t("auth.login.forgotPasswordLink")}
    </Link>
  );
};

export function ClientLoginForm() {
  const t = useTranslations();
  const posthog = usePostHog();
  const router = useRouter();
  const methods = Form.useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const orgSlug = useOrg();

  const onSubmit = methods.handleAsyncSubmit(async (values) => {
    const result = await clientLoginAction({
      email: values.email,
      password: values.password,
      orgSlug,
    });

    if (!result.success) {
      methods.setError("root", {
        message: t(`auth.login.errors.incorrect_email_or_password`),
        type: "validate",
      });

      return;
    }

    posthog?.alias(result.data.uuid, result.data.email);

    result.data.type === "customer"
      ? router.push(`/org/${result.data.orgSlug}/client`)
      : router.push(`/org/${result.data.orgSlug}/dashboard`);
  });

  return (
    <Form.Provider methods={methods}>
      <Form.Root onSubmit={onSubmit} className="gap-4">
        <EmailField />
        <PasswordInput
          autoComplete="current-password"
          {...methods.register("password", {
            required: {
              value: true,
              message: t(
                "client-portal.login.form.password.required.errorMessage",
              ),
            },
          })}
          TopRight={LabelWithForgotPasswordLink}
        />
        <ErrorMessage as={Message} name="root" />
        <Form.SubmitButton type="submit" className="mt-4">
          {t("client-portal.login.form.submit")}
        </Form.SubmitButton>
      </Form.Root>
    </Form.Provider>
  );
}
