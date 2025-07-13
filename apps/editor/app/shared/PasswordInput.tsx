"use client";

import { Form } from "@mioto/design-system/Form";
import { IconButton } from "@mioto/design-system/IconButton";
import { useTranslations } from "@mioto/locale";
import { Eye, EyeClosed } from "@phosphor-icons/react/dist/ssr";
import * as React from "react";

type Props = {
  hasPasswordResetLink?: boolean;
  fieldClassName?: string;
  inputClassName?: string;
  required?: boolean;
  strengthScore?: number;
} & Partial<Form.InputProps> &
  Partial<Pick<Form.FieldProps, "Label" | "TopRight">>;

export const PasswordInput = React.forwardRef<HTMLInputElement, Props>(
  function PasswordInput(
    { fieldClassName, inputClassName, Label, TopRight, ...props },
    ref,
  ) {
    const t = useTranslations();
    const [isHidden, setIsHidden] = React.useState(true);

    return (
      <Form.Field
        className={fieldClassName}
        Label={Label ?? t("components.password-input.label")}
        TopRight={TopRight}
      >
        <Form.Input
          ref={ref}
          className={inputClassName}
          type={isHidden ? "password" : "text"}
          placeholder="*******"
          Button={
            <IconButton
              type="button"
              variant="tertiary"
              size="small"
              square
              onClick={() => setIsHidden(!isHidden)}
              tooltip={{
                children: isHidden
                  ? t("components.password-input.tooltip.hidden")
                  : t("components.password-input.tooltip.visible"),
              }}
            >
              {isHidden ? <EyeClosed /> : <Eye />}
            </IconButton>
          }
          {...props}
        />
      </Form.Field>
    );
  },
);
