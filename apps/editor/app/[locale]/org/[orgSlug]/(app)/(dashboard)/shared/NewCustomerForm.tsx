import { DialogCloseButton } from "@mioto/design-system/Dialog";
import { Form } from "@mioto/design-system/Form";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import type { FormEventHandler } from "react";

export type NewCustomerFormData = {
  firstname: string;
  lastname: string;
  company: string;
  email: string;
  referenceNumber: string;
  portalAccess: boolean;
  sendEmail: boolean;
};

export function NewCustomerForm({
  methods,
  onSubmit,
}: {
  methods: Form.UseFormReturn<NewCustomerFormData>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
}) {
  const t = useTranslations();

  const withPortalAccess = methods.watch("portalAccess");

  return (
    <Form.Provider methods={methods}>
      <Form.Root className="gap-4" onSubmit={onSubmit}>
        <Form.Field Label={t("app.client.client-form.email.label")} required>
          <Form.Input
            {...methods.register("email", {
              required: {
                value: true,
                message: t("app.client.client-form.email.required"),
              },
            })}
            type="email"
          />
        </Form.Field>
        <Row className="gap-2">
          <Form.Field
            Label={t("app.client.client-form.firstname.label")}
            className="flex-1"
          >
            <Form.Input {...methods.register("firstname")} />
          </Form.Field>
          <Form.Field
            Label={t("app.client.client-form.lastname.label")}
            className="flex-1"
          >
            <Form.Input {...methods.register("lastname")} />
          </Form.Field>
        </Row>
        <Form.Field Label={t("app.client.client-form.company.label")}>
          <Form.Input {...methods.register("company")} />
        </Form.Field>
        <Form.Field Label={t("app.client.client-form.reference-number.label")}>
          <Form.Input {...methods.register("referenceNumber")} />
        </Form.Field>
        <Stack className="gap-2">
          <Form.Field
            Label={t("app.client.client-form.portal-access.label")}
            layout="constrained-right"
          >
            <Form.Checkbox
              {...methods.register("portalAccess", {
                onChange: (event) => {
                  if (!event.target.checked)
                    methods.setValue("sendEmail", false);
                },
              })}
            />
          </Form.Field>
          <Form.Field
            labelClassName={!withPortalAccess ? "text-gray8" : ""}
            Label={t("app.client.client-form.send-email.label")}
            layout="constrained-right"
          >
            <Form.Checkbox
              {...methods.register("sendEmail")}
              disabled={!withPortalAccess}
            />
          </Form.Field>
        </Stack>
        <Row className="gap-2 justify-end mt-6">
          <DialogCloseButton />
          <Row>
            <Form.SubmitButton name="save" className="rounded-r-none">
              {t("app.client.new-client.dialog.submit")}
            </Form.SubmitButton>
            <Form.SubmitButton
              name="next"
              className="rounded-l-none border-l-none"
              tooltip={{
                children: t("app.client.new-client.dialog.submit-and-next"),
              }}
              aria-label={t("app.client.new-client.dialog.submit-and-next")}
              isLoading={false}
            >
              <Plus />
            </Form.SubmitButton>
          </Row>
        </Row>
      </Form.Root>
    </Form.Provider>
  );
}
