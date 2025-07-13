"use client";

import { cardClasses } from "@mioto/design-system/Card";
import { Form } from "@mioto/design-system/Form";
import { Notification } from "@mioto/design-system/Notification";
import { useTranslations } from "@mioto/locale";
import { changeOrgSettingsAction } from "./changeOrgSettings.action";

type OrgSettingsFormProps = {
  orgName: string | null;
};

export function OrgSettingsForm({ orgName }: OrgSettingsFormProps) {
  const methods = Form.useForm({
    defaultValues: { name: orgName ?? undefined },
  });

  const onSubmit = methods.handleAsyncSubmit(async (data) => {
    await changeOrgSettingsAction(data);
    Notification.add({ Title: "Erfolgreich gespeichert", variant: "success" });
  });

  const t = useTranslations();

  return (
    <Form.Provider methods={methods}>
      <Form.Root className={cardClasses()} onSubmit={onSubmit}>
        <Form.Field Label={t("app.settings.org-config.form.name.label")}>
          <Form.Input
            {...methods.register("name")}
            placeholder={t("app.settings.org-config.form.name.placeholder")}
          />
        </Form.Field>

        <Form.SubmitButton
          className="self-end"
          disabled={!methods.formState.isDirty}
        >
          {t("app.settings.org-config.form.submit")}
        </Form.SubmitButton>
      </Form.Root>
    </Form.Provider>
  );
}
