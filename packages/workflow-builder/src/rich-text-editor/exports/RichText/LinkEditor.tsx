import { Form } from "@mioto/design-system/Form";
import { useTranslations } from "@mioto/locale";

export function LinkEditor({
  href,
  text,
  onLinkUpdate,
}: {
  href: string;
  text: string;
  onLinkUpdate: (href: string, text: string) => void;
}) {
  const methods = Form.useForm({
    defaultValues: {
      href,
      text,
    },
  });
  const t = useTranslations();

  return (
    <Form.Provider methods={methods}>
      <Form.Root
        onSubmit={methods.handleSubmit((values) => {
          try {
            const url = new URL(values.href);

            onLinkUpdate(url.href, values.text);
          } catch (error) {
            methods.setError("href", {
              type: "manual",
              message: t(
                "components.rich-text-editor.add-link.error.invalid-url",
              ),
            });
          }
        })}
      >
        <Form.Field
          name="href"
          Label={t("components.rich-text-editor.add-link.link.label")}
          className="gap-1"
          size="small"
          labelSize="small"
        >
          <Form.Input
            {...methods.register("href", {
              required: {
                value: true,
                message: t(
                  "components.rich-text-editor.add-link.link.errors.required",
                ),
              },
            })}
            className="min-w-[200px]"
            size="small"
          />
        </Form.Field>
        <Form.Field
          name="text"
          Label={t("components.rich-text-editor.add-link.link.text.label")}
          className="gap-1"
          size="small"
          labelSize="small"
        >
          <Form.Input
            {...methods.register("text")}
            size="small"
            className="min-w-[200px]"
          />
        </Form.Field>
        <Form.SubmitButton size="small" className="mt-1">
          {t("components.rich-text-editor.add-link.submit")}
        </Form.SubmitButton>
      </Form.Root>
    </Form.Provider>
  );
}
