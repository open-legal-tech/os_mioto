import { Form } from "@mioto/design-system/Form";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import {
  descriptionClasses,
  headerClasses,
  headingClasses,
} from "../../../shared/AuthCard";
import { isOrgSlugAvailableAction } from "./isOrgSlugAvailable.action";

type Props = {
  onSuccess: (params: { orgName: string; orgSlug: string }) => Promise<void>;
  className?: string;
  isLoading?: boolean;
};

export function OrgConfigForm({ onSuccess, className }: Props) {
  const t = useTranslations();
  const methods = Form.useForm<{
    orgName: string;
    orgSlug: string;
  }>();

  return (
    (<Stack className={`max-w-[500px] w-full ${className}`} key="register-form">
      <header className={headerClasses}>
        <h2 className={headingClasses}>{t("auth.register.org-form.title")}</h2>
        <Text className={descriptionClasses}>
          {t("auth.register.org-form.description")}
        </Text>
      </header>
      <main className="gap-6 mt-6">
        <Form.Provider methods={methods}>
          <Form.Root
            className={"gap-4 h-full"}
            onSubmit={methods.handleAsyncSubmit(async (values) => {
              const result = await isOrgSlugAvailableAction({
                orgSlug: values.orgSlug,
              });

              if (!result.success) {
                methods.setError("orgSlug", {
                  message: t(
                    `auth.create-org.form.slug.errors.slug-taken.message`,
                  ),
                });

                return;
              }

              onSuccess(values);
            })}
          >
            <Form.Field Label={t("auth.register.org-form.form.name.label")}>
              <Form.Input
                placeholder={t("auth.register.org-form.form.name.placeholder")}
                {...methods.register("orgName", {
                  required: {
                    value: true,
                    message: t(
                      "auth.register.org-form.form.name.errors.required.message",
                    ),
                  },
                })}
              />
            </Form.Field>
            <Form.Field
              Label={
                <>
                  {t.rich("auth.register.org-form.form.url.label")}

                  <HelpTooltip>
                    {t(
                      "auth.register.org-form.form.url.help-tooltip.description",
                    )}
                  </HelpTooltip>
                </>
              }
            >
              <Form.Input
                placeholder={t("auth.register.org-form.form.url.placeholder")}
                {...methods.register("orgSlug", {
                  required: {
                    value: true,
                    message: t(
                      "auth.register.org-form.form.url.errors.required.message",
                    ),
                  },
                  pattern: {
                    value: /^[A-Za-z0-9\-_]+$/,
                    message: t(
                      "auth.register.org-form.form.url.errors.pattern.message",
                    ),
                  },
                })}
              />
            </Form.Field>
            <Form.SubmitButton className="mt-4" type="submit">
              {t("auth.register.org-form.form.submit")}
            </Form.SubmitButton>
          </Form.Root>
        </Form.Provider>
      </main>
    </Stack>)
  );
}
