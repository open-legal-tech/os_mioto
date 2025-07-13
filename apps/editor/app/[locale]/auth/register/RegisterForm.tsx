import { Form } from "@mioto/design-system/Form";
import Link from "@mioto/design-system/Link";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import { pick } from "remeda";
import {
  descriptionClasses,
  headerClasses,
  headingClasses,
} from "../../../shared/AuthCard";
import { EmailField } from "../../../shared/EmailInput";
import NewPasswordInput from "../../../shared/NewPasswordInput";
import { PasswordInput } from "../../../shared/PasswordInput";
import { isAccountAvailableAction } from "./isAccountAvailable.action";

type Props = {
  className?: string;
  onSuccess: (values: {
    email: string;
    password: string;
    legal: boolean;
    newsletter: boolean;
  }) => void;
};

export const RegisterForm = ({ className, onSuccess }: Props) => {
  const t = useTranslations();

  const methods = Form.useForm<{
    email: string;
    password: string;
    passwordConfirmation: string;
    legal: boolean;
    privacy: boolean;
    terms: boolean;
    newsletter: boolean;
  }>();

  return (
    <Stack className={`max-w-[500px] w-full ${className}`} key="register-form">
      <header className={headerClasses}>
        <h2 className={headingClasses}>
          <span className="mr-4">👋</span>
          {t("auth.register.register-form.title")}
        </h2>
        <Text className={descriptionClasses}>
          {t("auth.register.register-form.description")}
        </Text>
      </header>
      <main className="gap-6 mt-6">
        <Form.Provider methods={methods}>
          <Form.Root
            className={"gap-4 h-full"}
            onSubmit={methods.handleAsyncSubmit(async (values) => {
              const result = await isAccountAvailableAction({
                email: values.email,
              });

              if (!result.success) {
                methods.setError("email", {
                  message: t(
                    "auth.register.register-form.email.error.already_used",
                  ),
                });

                return;
              }

              onSuccess(
                pick(methods.getValues(), [
                  "email",
                  "legal",
                  "newsletter",
                  "password",
                ]),
              );
            })}
          >
            <EmailField />
            <NewPasswordInput />
            <PasswordInput
              autoComplete="new-password"
              Label={t(
                "auth.register.register-form.form.passwordConfirmation.label",
              )}
              {...methods.register("passwordConfirmation", {
                required: {
                  value: true,
                  message: t(
                    "auth.register.register-form.form.new-password.errors.required.message",
                  ),
                },
                validate: (value) =>
                  value === methods.getValues("password") ||
                  t(
                    "auth.register.register-form.form.new-password.errors.no-match.message",
                  ),
              })}
            />
            <Stack className="gap-2 mt-4">
              <Stack>
                <div>
                  <Form.Checkbox
                    {...methods.register("terms", {
                      required: {
                        value: true,
                        message: t(
                          "auth.register.register-form.form.terms.errors.required.message",
                        ),
                      },
                    })}
                    className="inline align-middle mr-3"
                  />

                  <Form.Label
                    className="inline align-middle font-mediumText"
                    htmlFor="terms"
                  >
                    {t.rich("auth.register.register-form.form.terms.label", {
                      link: (chunks) => (
                        <Link
                          href={`/terms`}
                          target="_blank"
                          className="font-mediumText underline p-0"
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
                          "auth.register.register-form.form.privacy.errors.required.message",
                        ),
                      },
                    })}
                    className="inline align-middle mr-3"
                  />

                  <Form.Label
                    className="inline align-middle font-mediumText"
                    htmlFor="privacy"
                  >
                    {t.rich("auth.register.register-form.form.privacy.label", {
                      link: (chunks) => (
                        <Link
                          href={`/privacy`}
                          target="_blank"
                          className="font-mediumText underline p-0"
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
              <Stack>
                <div>
                  <Form.Checkbox
                    {...methods.register("legal", {
                      required: {
                        value: true,
                        message: t(
                          "auth.register.register-form.form.legal.errors.required.message",
                        ),
                      },
                    })}
                    className="inline align-middle mr-3"
                  />
                  <Form.Label
                    className="inline align-middle font-mediumText"
                    htmlFor="legal"
                  >
                    {t(
                      "auth.register.register-form.form.alphaDisclaimer.label",
                    )}
                  </Form.Label>
                </div>
                <Form.FormError
                  data-test={`error-legal`}
                  name="legal"
                  className="mt-2"
                />
              </Stack>
              <Stack>
                <div>
                  <Form.Checkbox
                    {...methods.register("newsletter")}
                    className="inline align-middle mr-3"
                  />
                  <Form.Label
                    className="inline align-middle font-mediumText"
                    htmlFor="newsletter"
                  >
                    {t("auth.register.register-form.newsletterSignUp")}
                  </Form.Label>
                </div>
                <Form.FormError
                  data-test={`error-newsletter`}
                  name="newsletter"
                  className="mt-2"
                />
              </Stack>
            </Stack>
            <Form.FormError name="root" />
            <Form.SubmitButton className="mt-4" type="submit">
              {t("auth.register.register-form.form.submit")}
            </Form.SubmitButton>
          </Form.Root>
        </Form.Provider>
      </main>
    </Stack>
  );
};
