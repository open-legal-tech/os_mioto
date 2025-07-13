"use client";

import { Form } from "@mioto/design-system/Form";
import { Message } from "@mioto/design-system/Message";
import { useTranslations } from "@mioto/locale";
import { forgotPasswordAction } from "@mioto/server/db/forgotPassword.action";
import {
  descriptionClasses,
  headerClasses,
  headingClasses,
} from "../../../shared/AuthCard";
import { EmailField } from "../../../shared/EmailInput";

export function ForgotPasswordForm() {
  const t = useTranslations();
  const methods = Form.useForm({
    defaultValues: { email: "" },
  });

  return !methods.formState.isSubmitSuccessful ? (
    <>
      <header className={headerClasses}>
        <h2 className={headingClasses}>{t("auth.forgotPassword.title")}</h2>
        <p className={descriptionClasses}>
          {t("auth.forgotPassword.description")}
        </p>
      </header>
      <main>
        <Form.Provider methods={methods}>
          <Form.Root
            onSubmit={methods.handleAsyncSubmit(async ({ email }) => {
              const result = await forgotPasswordAction({
                email,
                type: "employee",
              });

              if (!result.success) {
                return methods.setError("root", {
                  message: t("auth.forgotPassword.errors.user_not_found"),
                });
              }
            })}
            className="flex flex-col"
          >
            <EmailField />
            <Message data-test="form-error">
              {methods.formState.errors.root?.message}
            </Message>
            <Form.SubmitButton type="submit" className="mt-4">
              {t("auth.forgotPassword.submitButton")}
            </Form.SubmitButton>
          </Form.Root>
        </Form.Provider>
      </main>
    </>
  ) : (
    <header className={headerClasses}>
      <h2 className={headingClasses}>
        {t("auth.forgotPassword.success.title")}
      </h2>
      <p className={descriptionClasses}>
        {t("auth.forgotPassword.success.description")}
      </p>
    </header>
  );
}
