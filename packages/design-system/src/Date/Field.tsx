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
import { focusRing } from "../shared/focusRing";
import { twMerge } from "../tailwind/merge";
import { tv } from "../tailwind/tv";

export function Label(props: LabelProps) {
  return (
    <RACLabel
      {...props}
      className={twMerge(
        "text-sm text-gray5 font-medium cursor-default w-fit",
        props.className,
      )}
    />
  );
}

export function Description(props: TextProps) {
  return (
    <Text
      {...props}
      slot="description"
      className={twMerge("text-sm text-gray5", props.className)}
    />
  );
}

export function FieldError(props: FieldErrorProps) {
  return (
    <RACFieldError
      {...props}
      className={composeRenderProps(
        props.className,
        () => "text-sm text-danger7 forced-colors:text-[Mark]",
      )}
    />
  );
}

export const fieldGroupStyles = tv({
  extend: focusRing,
  base: "group flex items-center h-9 bg-gray1 forced-colors:bg-[Field] rounded border-gray6",
  variants: {
    isInvalid: {
      true: "border-danger5 forced-colors:border-[Mark]",
    },
    isDisabled: {
      true: "border-gray2 forced-colors:border-[GrayText]",
    },
  },
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

export function Input(props: InputProps) {
  return (
    <RACInput
      {...props}
      className={composeRenderProps(
        props.className,
        () =>
          "px-2 py-1.5 flex-1 min-w-0 outline outline-0 bg-white text-sm text-gray-800 disabled:text-gray-200-600",
      )}
    />
  );
}
