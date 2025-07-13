import { useTranslations } from "@mioto/locale";
import type { FieldValues, UseFormProps } from "react-hook-form";
import { Form } from "../Form";
import { Notification } from "../Notification";
import { sendEmailAction } from "./sendEmail.action";
import type { SendEmailParams } from "@mioto/email/sendEmail";

export function useContactForm<TValues extends FieldValues, TContext = any>(
  props?: UseFormProps<
    TValues & {
      email: string;
      name: string;
      message: string;
    },
    TContext
  > & { attachment?: SendEmailParams["attachments"]; onSuccess?: () => void },
) {
  const t = useTranslations();
  const methods = Form.useForm<
    {
      email: string;
      name: string;
      message: string;
    } & TValues,
    TContext
  >(props);

  const onSubmit = methods.handleAsyncSubmit(async (data) => {
    const result = await sendEmailAction({
      ...data,
      attachment: props?.attachment,
      subject: "Kontaktaufnahme",
    });

    if (!result.success)
      Notification.add({
        Title: t("components.contact-form.notifications.unknown.title"),
        Content: t("components.contact-form.notifications.unknown.content"),
        variant: "danger",
        type: "foreground",
      });
  });

  return {
    methods,
    onSubmit,
  };
}

type Props = {
  submitText: string;
  successMessage?: string;
  contactForm: ReturnType<typeof useContactForm>;
  children?: React.ReactNode;
};

export function ContactForm({
  submitText,
  successMessage,
  contactForm,
  children,
}: Props) {
  const t = useTranslations();

  return (
    <Form.Provider methods={contactForm.methods}>
      <Form.Root
        className="gap-4"
        onSubmit={contactForm.onSubmit}
        aria-label="contact-form"
      >
        <Form.Field Label="Dein Name">
          <Form.Input {...contactForm.methods.register("name")} />
        </Form.Field>
        <Form.Field Label={t("components.contact-form.form.email.label")}>
          <Form.Input
            {...contactForm.methods.register("email", {
              required: {
                value: true,
                message: t("components.contact-form.form.email.required"),
              },
            })}
          />
        </Form.Field>
        {children}
        <Form.Field Label={t("components.contact-form.form.message.label")}>
          <Form.Textarea
            rows={5}
            {...contactForm.methods.register("message", {
              required: {
                value: true,
                message: t("components.contact-form.form.message.required"),
              },
            })}
            className="w-full resize-none"
          />
        </Form.Field>
        <Form.SubmitButton
          isLoading={contactForm.methods.formState.isLoading}
          className="mt-4"
        >
          {submitText}
        </Form.SubmitButton>
        <Form.FormError name="root" />
        {contactForm.methods.formState.isSubmitSuccessful && successMessage ? (
          <Form.Message className="mt-2 p-4 colorScheme-success">
            {successMessage}
          </Form.Message>
        ) : null}
      </Form.Root>
    </Form.Provider>
  );
}
