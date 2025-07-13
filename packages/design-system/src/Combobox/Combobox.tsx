"use client";

import {
  Combobox,
  ComboboxCancel,
  type ComboboxCancelOptions,
  ComboboxDisclosure,
  type ComboboxDisclosureProps,
  ComboboxItemValue,
  type ComboboxItemValueProps,
  ComboboxPopover,
  type ComboboxPopoverProps,
  type ComboboxProps,
  ComboboxRow,
  type ComboboxRowProps,
  ComboboxSeparator,
  type ComboboxSeparatorProps,
  type ComboboxStore,
} from "@ariakit/react/combobox";
import { type MatchSorterOptions, matchSorter } from "match-sorter";
import * as React from "react";
import type { InputProps as SystemInputProps } from "../Input/Input";
import { Input as SystemInput } from "../Input/Input";
import { separatorClasses } from "../Separator/Separator";
import { menuContainerClasses } from "../shared/menuClasses";
import { twMerge } from "../tailwind/merge";

export * from "./ComboboxGroupLabel";
export * from "./ComboboxItem";
export * from "./ComboboxList";
export * from "./ComboboxGroup";

// ------------------------------------------------------------------
export type InputProps = Omit<ComboboxProps, "className"> &
  Omit<SystemInputProps, "name" | "state">;

export const Input = ({ store, Icon, ...props }: InputProps) => {
  return (
    <Combobox
      {...props}
      render={(htmlProps) => <SystemInput {...htmlProps} Icon={Icon} />}
      store={store}
    />
  );
};

// ------------------------------------------------------------------
// Popover
export type PopoverProps = ComboboxPopoverProps;

export const Popover = ({ className, ...props }: PopoverProps) => {
  return (
    <ComboboxPopover
      className={twMerge(menuContainerClasses, className)}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
// Cancel
export type CancelProps = ComboboxCancelOptions;

export const Cancel = ComboboxCancel;

// ------------------------------------------------------------------
// Disclosure
export type DisclosureProps = ComboboxDisclosureProps;

export const Disclosure = ComboboxDisclosure;

// ------------------------------------------------------------------
// ItemValue
export type ItemValueProps = ComboboxItemValueProps;

export const ItemValue = ComboboxItemValue;

// ------------------------------------------------------------------
// Row

export type RowProps = ComboboxRowProps;

export const Row = ComboboxRow;

// ------------------------------------------------------------------
// Separator

export type SeparatorProps = ComboboxSeparatorProps;

export const Separator = ({ className, ...props }: SeparatorProps) => {
  return (
    <ComboboxSeparator
      className={separatorClasses({}, [className])}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
export { useComboboxStore } from "@ariakit/react/combobox";

export function useMatches<TList extends string | Record<string, any>>(
  combobox: ComboboxStore,
  list: TList[],
  options?: MatchSorterOptions<TList>,
) {
  const value = combobox.useState("value");
  const deferredValue = React.useDeferredValue(value);

  return React.useMemo(
    () => matchSorter(list, deferredValue, options),
    [deferredValue, options, list],
  );
}
