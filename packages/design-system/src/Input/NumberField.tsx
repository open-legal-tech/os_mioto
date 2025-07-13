import { CaretDown, CaretUp } from "@phosphor-icons/react";
import React from "react";
import {
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
  Button,
  type ButtonProps,
  type ValidationResult,
  composeRenderProps,
} from "react-aria-components";
import { Stack } from "../Stack";
import { Description, FieldError, FieldGroup, Input, Label } from "./Field";

export interface NumberFieldProps extends AriaNumberFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
}

export const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  ({ label, description, placeholder, errorMessage, ...props }, ref) => {
    return (
      <AriaNumberField
        {...props}
        className={composeRenderProps(
          props.className,
          () => "group flex flex-col gap-1",
        )}
      >
        <Label>{label}</Label>
        <FieldGroup>
          {() => (
            <>
              <Input ref={ref} className="h-full" placeholder={placeholder} />
              <Stack className="gap-1 pr-2">
                <StepperButton slot="increment">
                  <CaretUp aria-hidden />
                </StepperButton>
                <StepperButton slot="decrement">
                  <CaretDown aria-hidden />
                </StepperButton>
              </Stack>
            </>
          )}
        </FieldGroup>
        {description && <Description>{description}</Description>}
        <FieldError>{errorMessage}</FieldError>
      </AriaNumberField>
    );
  },
);

function StepperButton(props: ButtonProps) {
  return <Button {...props} className="cursor-default pressed:bg-gray-100" />;
}
