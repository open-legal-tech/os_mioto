"use client";

import { useTranslations } from "@mioto/locale";
import Badge from "../Badge";
import type { useContactForm } from "../ContactForm/ContactForm";
import { DialogDefault, DialogRoot, DialogTrigger } from "../Dialog";
import { Form } from "../Form";
import Heading from "../Heading";
import { Message } from "../Message";
import { Row } from "../Row";
import Separator from "../Separator";
import Text from "../Text";

type Props = {
  open: boolean;
  onCancel: () => void;
  className?: string;
  addedData?: string[];
  contactForm: ReturnType<typeof useContactForm>;
  children?: React.ReactNode;
};

export function SupportDialog({
  open,
  onCancel,
  children,
  addedData,
  contactForm,
}: Props) {
  const t = useTranslations();

  return (
    <Form.Provider methods={contactForm.methods}>
      <DialogRoot open={open} onOpenChange={onCancel}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        <DialogDefault
          title={t("components.supportDialog.title")}
          ConfirmationButton={
            <Form.SubmitButton
              isLoading={contactForm.methods.formState.isLoading}
              disabled={contactForm.methods.formState.isSubmitSuccessful}
            >
              {t("components.supportDialog.submit")}
            </Form.SubmitButton>
          }
        >
          <Form.Root className="gap-4" onSubmit={contactForm.onSubmit}>
            <Form.Field Label="Dein Name">
              <Form.Input {...contactForm.methods.register("name")} />
            </Form.Field>
            <Form.Field
              Label={t("components.supportDialog.form.email.label")}
              required
            >
              <Form.Input
                {...contactForm.methods.register("email", {
                  required: {
                    value: true,
                    message: t("components.supportDialog.form.email.required"),
                  },
                })}
              />
            </Form.Field>
            <Form.Field
              Label={t("components.supportDialog.form.message.label")}
              required
            >
              <Form.Textarea
                rows={5}
                {...contactForm.methods.register("message", {
                  required: {
                    value: true,
                    message: t(
                      "components.supportDialog.form.message.required",
                    ),
                  },
                })}
                className="w-full resize-none"
              />
            </Form.Field>
            {addedData ? (
              <>
                <Separator />
                <Heading size="extra-small">
                  {t("components.supportDialog.added-data.title")}
                </Heading>
                <Text>
                  {t("components.supportDialog.added-data.description")}
                </Text>
                <Row className="gap-2">
                  {addedData.map((label) => (
                    <Badge key={label}>{label}</Badge>
                  ))}
                </Row>
              </>
            ) : null}
            <Form.FormError name="root" />
          </Form.Root>
          {contactForm.methods.formState.isSubmitSuccessful ? (
            <Message className="mt-2 colorScheme-success">
              {t("components.supportDialog.success")}
            </Message>
          ) : null}
        </DialogDefault>
      </DialogRoot>
    </Form.Provider>
  );
}
