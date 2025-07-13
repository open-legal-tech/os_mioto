"use client";
import { DialogDefault, useDialogContext } from "@mioto/design-system/Dialog";
import { Form } from "@mioto/design-system/Form";
import { Notification } from "@mioto/design-system/Notification";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { updateClientAction } from "./updateClient.action";

export type EditClientDialogProps = {
  customerUuid: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  referenceNumber?: string;
  company?: string;
  portalAccess: boolean;
};

export function EditClientDialogClient({
  customerUuid,
  firstname,
  lastname,
  email,
  referenceNumber,
  company,
  portalAccess,
}: EditClientDialogProps) {
  const t = useTranslations();

  const methods = Form.useForm({
    values: {
      firstname,
      lastname,
      email,
      referenceNumber,
      company,
      portalAccess,
      sendEmail: false,
    },
  });

  const withPortalAccess = methods.watch("portalAccess");

  const { close } = useDialogContext();

  return (
    <Form.Provider methods={methods}>
      <DialogDefault
        title={t("app.client.edit-client.dialog.title")}
        ConfirmationButton={
          <Form.SubmitButton>
            {t("app.client.new-client.dialog.submit")}
          </Form.SubmitButton>
        }
      >
        <Form.Root
          className="gap-4"
          onSubmit={methods.handleAsyncSubmit(
            async ({ sendEmail, ...values }) => {
              const result = await updateClientAction({
                uuid: customerUuid,
                sendEmail: sendEmail
                  ? portalAccess
                    ? "update"
                    : "invite"
                  : undefined,
                ...values,
              });

              Notification.add({
                Title: t(
                  "app.client.edit-client.dialog.notification.success.title",
                ),
                Content: t(
                  "app.client.edit-client.dialog.notification.success.content",
                  { name: result.data.fullName ?? values.email },
                ),
                variant: "success",
              });

              close();
            },
          )}
        >
          <Form.Field
            Label={t("app.client.edit-client-form.email.label")}
            required
          >
            <Form.Input
              autoFocus
              {...methods.register("email", {
                required: {
                  value: true,
                  message: t("app.client.edit-client-form.email.required"),
                },
              })}
              type="email"
            />
          </Form.Field>
          <Row className="gap-2">
            <Form.Field
              Label={t("app.client.edit-client-form.firstname.label")}
              className="flex-1"
            >
              <Form.Input {...methods.register("firstname")} />
            </Form.Field>
            <Form.Field
              Label={t("app.client.edit-client-form.lastname.label")}
              className="flex-1"
            >
              <Form.Input {...methods.register("lastname")} />
            </Form.Field>
          </Row>
          <Form.Field Label={t("app.client.edit-client-form.company.label")}>
            <Form.Input {...methods.register("company")} />
          </Form.Field>
          <Form.Field
            Label={t("app.client.edit-client-form.reference-number.label")}
          >
            <Form.Input {...methods.register("referenceNumber")} />
          </Form.Field>
          <Stack className="gap-2">
            <Form.Field
              Label={t("app.client.edit-client-form.portal-access.label")}
              layout="constrained-right"
            >
              <Form.Checkbox
                {...methods.register("portalAccess", {
                  onChange: (event) => {
                    methods.setValue("sendEmail", event.target.checked);
                  },
                })}
              />
            </Form.Field>
            {portalAccess ? (
              <Form.Field
                Label={t("app.client.edit-client-form.send-email.label")}
                layout="constrained-right"
                labelClassName={!withPortalAccess ? "text-gray8" : ""}
              >
                <Form.Checkbox
                  {...methods.register("sendEmail")}
                  disabled={
                    !withPortalAccess && methods.formState.dirtyFields.email
                  }
                />
              </Form.Field>
            ) : (
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
            )}
          </Stack>
        </Form.Root>
      </DialogDefault>
    </Form.Provider>
  );
}
