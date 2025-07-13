"use client";

import { ErrorMessage } from "@hookform/error-message";
import { Form } from "@mioto/design-system/Form";
import Link from "@mioto/design-system/Link";
import { useOrg } from "@mioto/design-system/Org";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import type { LegalDocumentVersions } from "@mioto/server/User/shared";
import {
  headerClasses,
  headingClasses,
} from "../../../../../../shared/AuthCard";
import { EmailField } from "../../../../../../shared/EmailInput";
import NewPasswordInput from "../../../../../../shared/NewPasswordInput";
import { PasswordInput } from "../../../../../../shared/PasswordInput";
import { registerCustomerAction } from "./registerCustomer.action";

type Props = {
  email: string;
  legalVersions: LegalDocumentVersions;
  userUuid: string;
  className?: string;
  orgName?: string;
};

export const RegisterInviteForm = ({
  email,
  legalVersions,
  userUuid,
  className,
  orgName,
}: Props) => {
  const orgSlug = useOrg();
  const t = useTranslations();

  const methods = Form.useForm<{
    email: string;
    password: string;
    passwordConfirmation: string;
    legal: boolean;
    privacy: boolean;
    terms: boolean;
  }>({ defaultValues: { email } });

  return (
    <Stack className={`max-w-[500px] ${className}`}>
      {orgName ? (
        <header className={headerClasses}>
          <h2 className={`${headingClasses} self-center`}>{orgName}</h2>
        </header>
      ) : null}
      <main className="gap-6 mt-6">
        <Form.Provider methods={methods}>
          <Form.Root
            className={"gap-4"}
            onSubmit={methods.handleAsyncSubmit(async (values) => {
              const result = await registerCustomerAction({
                userUuid,
                password: values.password,
                legal: legalVersions,
              });

              if (!result.success) {
                return methods.setError("root", {
                  type: "validate",
                  message: t(
                    `client-portal.register.errors.${result.failure.code}`,
                  ),
                });
              }
            })}
          >
            <EmailField size="large" disabled />
            <NewPasswordInput size="large" />
            <PasswordInput
              autoComplete="new-password"
              Label={t("client-portal.register.passwordConfirmation.label")}
              {...methods.register("passwordConfirmation", {
                required: {
                  value: true,
                  message: t(
                    "client-portal.register.passwordConfirmation.required.errorMessage",
                  ),
                },
                validate: (value) =>
                  value === methods.getValues("password") ||
                  t(
                    "client-portal.register.passwordConfirmation.mismatch.errorMessage",
                  ),
              })}
              size="large"
            />
            <Stack className="gap-2 mt-4">
              <Stack>
                <div>
                  <Form.Checkbox
                    {...methods.register("terms", {
                      required: {
                        value: true,
                        message: t(
                          "client-portal.register.terms.required.errorMessage",
                        ),
                      },
                    })}
                    className="inline align-middle mr-3"
                  />
                  <Form.Label
                    className="inline align-middle font-mediumText"
                    htmlFor="terms"
                  >
                    {t.rich("client-portal.register.terms.label", {
                      link: (chunks) => (
                        <Link
                          href={`/api/${orgSlug}/terms`}
                          target="_blank"
                          underline
                        >
                          {chunks}
                        </Link>
                      ),
                    })}
                  </Form.Label>
                </div>
                <Form.FormError
                  data-test={`error-terms`}
                  className="mt-2"
                  name="terms"
                />
              </Stack>
              <Stack>
                <div>
                  <Form.Checkbox
                    {...methods.register("privacy", {
                      required: {
                        value: true,
                        message: t(
                          "client-portal.register.data-protection.required.errorMessage",
                        ),
                      },
                    })}
                    className="inline align-middle mr-3"
                  />
                  <Form.Label
                    className="inline align-middle font-mediumText"
                    htmlFor="privacy"
                  >
                    {t.rich("client-portal.register.data-protection.label", {
                      link: (chunks) => (
                        <Link
                          href={`/api/${orgSlug}/privacy`}
                          target="_blank"
                          underline
                        >
                          {chunks}
                        </Link>
                      ),
                    })}
                  </Form.Label>
                </div>
                <Form.FormError
                  data-test={`error-privacy`}
                  className="mt-2"
                  name="privacy"
                />
              </Stack>
            </Stack>
            <ErrorMessage name="root" as={Form.Message} className="mt-4" />
            <Form.SubmitButton className="mt-4" type="submit">
              {t("client-portal.register.submit")}
            </Form.SubmitButton>
          </Form.Root>
        </Form.Provider>
      </main>
    </Stack>
  );
};
