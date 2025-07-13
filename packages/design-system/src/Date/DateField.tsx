import {
  DateField as AriaDateField,
  type DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  type DateInputProps,
  DateSegment,
  type DateValue,
  type ValidationResult,
  composeRenderProps,
} from "react-aria-components";
import { textClasses } from "../Text/classes";
import { tv } from "../tailwind/tv";
import { Description, FieldError, Label, fieldGroupStyles } from "./Field";

export interface DateFieldProps<T extends DateValue>
  extends AriaDateFieldProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DateField<T extends DateValue>({
  label,
  description,
  errorMessage,
  ...props
}: DateFieldProps<T>) {
  return (
    <AriaDateField
      {...props}
      className={composeRenderProps(
        props.className,
        () => "flex flex-col gap-1",
      )}
    >
      {label && <Label>{label}</Label>}
      <DateInput />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaDateField>
  );
}

const segmentStyles = tv({
  base: `inline p-[1px] type-literal:p-0 rounded-sm outline outline-0 caret-transparent text-gray10 ${textClasses(
    {},
  )}`,
  variants: {
    isPlaceholder: {
      true: "text-gray8 italic p-[3px]",
    },
    isDisabled: {
      true: "text-gray3",
    },
    isFocused: {
      true: "bg-primary7 text-white",
    },
  },
});

export function DateInput(props: Omit<DateInputProps, "children">) {
  return (
    <AriaDateInput
      className={(renderProps) =>
        fieldGroupStyles({
          ...renderProps,
          class: "block min-w-[150px] px-2 py-1.5 text-sm",
        })
      }
      {...props}
    >
      {(segment) => <DateSegment segment={segment} className={segmentStyles} />}
    </AriaDateInput>
  );
}
