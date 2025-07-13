"use client";

import { Form } from "@mioto/design-system/Form";
import { useTranslations } from "@mioto/locale";

type Props = {
  className?: string;
  inputClassName?: string;
  required?: boolean;
  Label?: React.ReactNode;
} & Partial<Form.InputProps>;

export const EmailField = ({
  className,
  inputClassName,
  required = true,
  disabled,
  Label,
  ...props
}: Props) => {
  const t = useTranslations();
  const { register } = Form.useFormContext();

  return (
    <Form.Field
      className={className}
      Label={Label ?? t("components.email-input.label")}
    >
      <Form.Input
        {...register("email", {
          required: {
            value: required,
            message: t("components.email-input.required.errorMessage"),
          },
        })}
        className={inputClassName}
        type="email"
        placeholder={t("components.email-input.placeholder")}
        disabled={disabled}
        {...props}
      />
    </Form.Field>
  );
};
