import React from "react";
import {
  type FieldErrorProps,
  Group,
  type GroupProps,
  type InputProps,
  type LabelProps,
  FieldError as RACFieldError,
  Input as RACInput,
  Label as RACLabel,
  Text,
  type TextProps,
  composeRenderProps,
} from "react-aria-components";
import { messageClasses } from "../Message";
import { twMerge } from "../tailwind/merge";
import { tv } from "../tailwind/tv";

export function Label(props: LabelProps) {
  return (
    <RACLabel
      {...props}
      className={twMerge("text-mediumText w-fit", props.className)}
    />
  );
}

export function Description(props: TextProps) {
  return (
    <Text
      {...props}
      slot="description"
      className={twMerge("text-smallText", props.className)}
    />
  );
}

export function FieldError(props: FieldErrorProps) {
  return (
    <RACFieldError
      {...props}
      className={composeRenderProps(props.className, () =>
        messageClasses({ colorScheme: "danger" }),
      )}
    />
  );
}

export const fieldBorderStyles = tv({
  base: "border border-gray6",
  variants: {
    isInvalid: {
      true: "border-danger5",
    },
    isDisabled: {
      true: "border-gray2",
    },
    isFocusWithin: {
      true: "border-primary6",
    },
  },
});

export const fieldGroupStyles = tv({
  base: [
    "group flex items-center bg-gray1 border rounded h-[38px]",
    fieldBorderStyles.base,
  ],
  variants: fieldBorderStyles.variants,
});

export function FieldGroup(props: GroupProps) {
  return (
    <Group
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        fieldGroupStyles({ ...renderProps, className }),
      )}
    />
  );
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return (
      <RACInput
        ref={ref}
        {...props}
        className={composeRenderProps(
          props.className,
          () => "px-3 py-2 flex-1 min-w-0 outline outline-0 bg-transparent",
        )}
      />
    );
  },
);
