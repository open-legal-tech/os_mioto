"use client";

import { Form } from "@mioto/design-system/Form";
import Heading from "@mioto/design-system/Heading";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import { getTranslations } from "@mioto/locale/server";
import { updateOrgAction } from "./updateOrgAction";

export const generateMetadata = async () => {
  const t = await getTranslations();

  return { title: t("auth.create-org.pageTitle") };
};

export function CreateOrgForm() {
  const methods = Form.useForm<{ name: string; slug: string }>();
  const t = useTranslations();

  return (
    (<Form.Provider methods={methods}>
      <Form.Root
        className="gap-4"
        onSubmit={methods.handleAsyncSubmit(async (values) => {
          const result = await updateOrgAction({
            name: values.name,
            slug: values.slug,
          });

          if (!result.success) {
            return methods.setError("slug", {
              message: t("auth.create-org.form.slug.errors.slug-taken.message"),
              type: "validate",
            });
          }
        })}
      >
        <Stack className="gap-2">
          <Heading size="extra-small">
            {t("auth.create-org.form.name.heading")}
          </Heading>
          <Text>{t("auth.create-org.form.name.description")}</Text>
          <Form.Field Label={t("auth.create-org.form.name.label")}>
            <Form.Input
              placeholder={t("auth.create-org.form.name.placeholder")}
              {...methods.register("name", {
                required: {
                  value: true,
                  message: t(
                    "auth.create-org.form.name.errors.required.message",
                  ),
                },
              })}
            />
          </Form.Field>
        </Stack>
        <Stack className="gap-2">
          <Heading size="extra-small">
            {t("auth.create-org.form.slug.title")}
          </Heading>
          <Text>{t.rich("auth.create-org.form.slug.description")}</Text>
          <Form.Field
            Label={<Text>{t.rich("auth.create-org.form.slug.label")}</Text>}
          >
            <Form.Input
              placeholder={t("auth.create-org.form.slug.placeholder")}
              {...methods.register("slug", {
                required: {
                  value: true,
                  message: t(
                    "auth.create-org.form.slug.errors.required.message",
                  ),
                },
                pattern: {
                  value: /^[A-Za-z0-9\-_]+$/,
                  message: t(
                    "auth.create-org.form.slug.errors.allowed-characters.message",
                  ),
                },
              })}
            />
          </Form.Field>
        </Stack>
        <Form.SubmitButton>
          {t("auth.create-org.form.submit")}
        </Form.SubmitButton>
      </Form.Root>
    </Form.Provider>)
  );
}
