"use client";

import { Button } from "@mioto/design-system/Button";
import { Form } from "@mioto/design-system/Form";
import { Heading } from "@mioto/design-system/Heading";
import type { InputProps } from "@mioto/design-system/Input";
import { Popover } from "@mioto/design-system/Popover";
import { Text } from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import * as React from "react";
import { PasswordInput } from "./PasswordInput";
import { isStrongPassword } from "@mioto/server/Auth/validatePasswordStrength";

type Props = Partial<Pick<Form.FieldProps, "Label" | "name">> &
  Pick<InputProps, "size">;

export const NewPasswordInput = ({ Label, name, size }: Props) => {
  const { register } = Form.useFormContext();
  const [strengthScore, setStrengthScore] = React.useState<number>(0);
  const t = useTranslations();

  return (
    <PasswordInput
      Label={Label}
      TopRight={(props) => (
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button
              variant="secondary"
              colorScheme={
                strengthScore === 0
                  ? "gray"
                  : strengthScore >= 3
                    ? "success"
                    : "danger"
              }
              size="small"
              {...props}
            >
              {t("components.new-password-input.strength-indicator.label", {
                strengthScore,
              })}
            </Button>
          </Popover.Trigger>
          <Popover.Content className="max-w-[300px] p-4">
            <Heading size="extra-small" className="mb-2">
              {t(
                "components.new-password-input.strength-indicator.popover.title",
              )}
            </Heading>
            <Text className="text-gray9">
              {t(
                "components.new-password-input.strength-indicator.popover.description",
              )}
            </Text>
            <ul className="mt-2">
              <li className="my-0">
                {t("components.new-password-input.strength-indicator.tipps.1")}
              </li>
              <li className="my-0">
                {t("components.new-password-input.strength-indicator.tipps.2")}
              </li>
              <li className="my-0">
                {t("components.new-password-input.strength-indicator.tipps.3")}
              </li>
              <li className="my-0">
                {t("components.new-password-input.strength-indicator.tipps.4")}
              </li>
            </ul>
          </Popover.Content>
        </Popover.Root>
      )}
      autoComplete="new-password"
      {...register(name ?? "password", {
        required: {
          value: true,
          message: t(
            "components.new-password-input.form.new-password.required",
          ),
        },
        validate: async (value) => {
          const result = await isStrongPassword(value);

          if (result.score < 3) {
            return t(
              "components.new-password-input.form.new-password.weak_password",
            );
          }

          return true;
        },
        async onChange(event) {
          const result = await isStrongPassword(event.target.value);

          setStrengthScore(result.score);
        },
      })}
      size={size}
    />
  );
};

export default NewPasswordInput;
