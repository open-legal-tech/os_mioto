"use client";

import { usePostHog } from "@mioto/analytics/client";
import { Form } from "@mioto/design-system/Form";
import Link from "@mioto/design-system/Link";
import { useTranslations } from "@mioto/locale";
import { loginAction } from "@mioto/server/actions/login.action";
import { EmailField } from "../../../shared/EmailInput";
import { PasswordInput } from "../../../shared/PasswordInput";
import { useRouter } from "../../../../i18n/routing";

const LabelWithForgotPasswordLink = (props: Form.FieldTopRightProps) => {
  const t = useTranslations();

  return (
    <Link href="/auth/forgot-password" size="small" {...props}>
      {t("auth.login.forgotPasswordLink")}
    </Link>
  );
};

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const t = useTranslations();
  const posthog = usePostHog();
  const router = useRouter();
  const methods = Form.useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = methods.handleAsyncSubmit(async (values) => {
    const result = await loginAction({
      email: values.email,
      password: values.password,
    });

    if (!result?.success) {
      return methods.setError("root", {
        message: t(`auth.login.errors.${result.failure.code}`),
        type: "validate",
      });
    }

    posthog?.alias(result.data.uuid, result.data.email);

    result.data.type === "customer"
      ? router.push(`/org/${result.data.orgSlug}/client`)
      : router.push(redirectTo ?? `/org/${result.data.orgSlug}/dashboard`);
  });

  return (
    <Form.Provider methods={methods}>
      <Form.Root onSubmit={onSubmit} className="gap-4">
        <EmailField />
        <PasswordInput
          autoComplete="current-password"
          {...methods.register("password", {
            required: { value: true, message: "Bitte gib dein Passwort ein." },
          })}
          TopRight={LabelWithForgotPasswordLink}
        />
        <Form.FormError name="root" />
        <Form.SubmitButton type="submit" className="mt-4">
          {t("auth.login.submit")}
        </Form.SubmitButton>
      </Form.Root>
    </Form.Provider>
  );
}
