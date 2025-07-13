"use client";

import { Form } from "@mioto/design-system/Form";
import Heading from "@mioto/design-system/Heading";
import { Message } from "@mioto/design-system/Message";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { forgotPasswordAction } from "@mioto/server/db/forgotPassword.action";
import {
  headerClasses,
  headingClasses,
} from "../../../../../../shared/AuthCard";
import { EmailField } from "../../../../../../shared/EmailInput";

export function ForgotPasswordForm() {
  const t = useTranslations();
  const methods = Form.useForm({
    defaultValues: { email: "" },
  });

  return (
    <Stack className="max-w-[500px] flex-1 justify-center gap-4">
      {!methods.formState.isSubmitSuccessful ? (
        <>
          <header className={headerClasses}>
            <Heading level={2}>{t("auth.forgotPassword.title")}</Heading>
          </header>
          <main>
            <Form.Provider methods={methods}>
              <Form.Root
                onSubmit={methods.handleAsyncSubmit(async ({ email }) => {
                  const result = await forgotPasswordAction({
                    email,
                    type: "customer",
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
          <p>{t("auth.forgotPassword.success.description")}</p>
        </header>
      )}
    </Stack>
  );
}
