import { Select, type SelectProps } from "@ariakit/react/select";
import * as React from "react";
import { flat, isDefined } from "remeda";
import { type ButtonVariants, buttonClasses } from "../Button";
import type {
  GroupOption,
  Option,
  Options,
  SubOption,
} from "../SelectWithCombobox";
import { useSelectContext, useSelectOptions } from "./Select";
import { Arrow } from "./SelectArrow";

export type InputProps = Omit<SelectProps, "value"> &
  ButtonVariants & {
    /**
     * This option is used to shorten the value displayed in the select. To avoid overflows.
     * The full value is displayed in a tooltip on hover.
     * @default 100
     */
    maxValueLength?: number;

    /**
     * This option is used to combine multiple values into one string to display as the value.
     */
    valueCombinator?: string | "break";
    renderValue?: (
      values: (Option<any> | GroupOption<any> | SubOption<any>)[],
    ) => React.ReactNode;
    value?: string;
    options?: Options<any>;
    placeholder?: string;
  };

export const Input = React.forwardRef(function SelectInput(
  {
    id,
    maxValueLength = 100,
    store: incomingStore,
    valueCombinator = ", ",
    renderValue,
    placeholder,
    className,
    size = "medium",
    isLoading,
    disabled,
    options: incomingOptions,
    variant = "secondary",
    colorScheme = "gray",
    alignByContent,
    emphasize,
    round,
    square,
    ...props
  }: InputProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const store = incomingStore ?? useSelectContext();
  const options = incomingOptions ?? useSelectOptions();
  const value = store?.useState("value");

  let selectValue = value;

  let shortenedSelectValue: string | undefined;

  const flatOptions = flat(
    options?.map((option) =>
      option.type === "group-option" ? [option, ...option.subOptions] : option,
    ) ?? [],
  );

  let values = [];
  if (typeof value === "string" || value instanceof String) {
    if (value.includes(valueCombinator)) {
      values = value.split(valueCombinator);
    } else {
      values = [value];
    }
  } else {
    values = value;
  }

  const arrayValues = values
    .map((value) => flatOptions.find((item) => item.id === value))
    .filter(isDefined);

  if (options) {
    selectValue = arrayValues
      .map((value) => value?.name)
      .join(valueCombinator === "break" ? "\n" : valueCombinator);

    if (selectValue && selectValue.length > maxValueLength) {
      const selectValueParts = Array.isArray(selectValue)
        ? selectValue
        : selectValue.split(valueCombinator);

      const firstSelectValuePart = selectValueParts[0];

      if (firstSelectValuePart.length > maxValueLength) {
        shortenedSelectValue = `${firstSelectValuePart.substring(
          0,
          maxValueLength,
        )}...`;
      } else {
        shortenedSelectValue = firstSelectValuePart;
      }
    }
  }

  return (
    <Select
      className={buttonClasses({
        variant,
        colorScheme,
        className: `${className} justify-between`,
        size,
        isLoading,
        alignByContent,
        emphasize,
        round,
        square,
      })}
      ref={ref}
      id={id}
      store={store}
      disabled={disabled || isLoading}
      {...props}
    >
      {selectValue?.length > 0 ? (
        (renderValue?.(arrayValues) ?? shortenedSelectValue ?? selectValue)
      ) : (
        <span className="text-gray8">{placeholder}</span>
      )}
      <Arrow />
    </Select>
  );
});
