import { Form } from "@mioto/design-system/Form";
import { useTranslations } from "@mioto/locale";

export function TreeNameInput() {
  const t = useTranslations();
  const { register } = Form.useFormContext();

  return (
    <Form.Field Label={t("components.tree-name-input.label")}>
      <Form.Input
        {...register("treeName", {
          required: {
            value: true,
            message: t("components.tree-name-input.required"),
          },
          maxLength: {
            value: 100,
            message: t("components.tree-name-input.length", {
              treeNameMaxLength: 100,
            }),
          },
        })}
        placeholder={t("components.tree-name-input.placeholder")}
      />
    </Form.Field>
  );
}
