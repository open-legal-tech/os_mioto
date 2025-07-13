"use client";

import * as SelectPrimitive from "@ariakit/react/select";
import * as React from "react";
import { labelClasses } from "../Label";
import { LoadingSpinner } from "../LoadingSpinner";
import { Row as SystemRow } from "../Row";
import type { Options } from "../SelectWithCombobox";
import { separatorClasses } from "../Separator/Separator";
import {
  dropdownItemStyles,
  menuContainerClasses,
  menuItemClasses,
} from "../shared/menuClasses";
import type { WithClassNameArray } from "../utils/types";

export * from "./SelectInput";
export * from "./SelectPopover";
export * from "./SelectArrow";

export type RootProps = Required<
  Pick<SelectPrimitive.SelectProviderProps, "store" | "children">
> & { options: Options };

const OptionContext = React.createContext<{ options: Options } | null>(null);

export const Root = ({ children, store, options }: RootProps) => (
  <OptionContext.Provider value={{ options }}>
    <SelectPrimitive.SelectProvider store={store}>
      {children}
    </SelectPrimitive.SelectProvider>
  </OptionContext.Provider>
);

export const useSelectOptions = () => {
  const context = React.useContext(OptionContext);
  if (!context) {
    throw new Error("useSelectOptions must be used within a Select.Root");
  }
  return context.options;
};

export const useSelectStore = SelectPrimitive.useSelectStore;
export const useSelectContext = () => {
  const context = SelectPrimitive.useSelectContext();

  if (!context) {
    throw new Error("useSelectContext must be used within a Select.Root");
  }

  return context;
};

// ------------------------------------------------------------------
// Item

export type ItemProps = SelectPrimitive.SelectItemProps & {
  isLoading?: boolean;
  Icon?: React.ReactNode;
};

export const Item = React.forwardRef<
  HTMLDivElement,
  WithClassNameArray<ItemProps>
>(({ className, children, isLoading, Icon, ...props }, ref) => {
  return (
    <SelectPrimitive.SelectItem
      className={dropdownItemStyles({ className })}
      ref={ref}
      role="option"
      {...props}
    >
      {isLoading ? <LoadingSpinner /> : Icon}
      <SystemRow className="justify-between flex-1 items-center">
        {children}
        <ItemCheck />
      </SystemRow>
    </SelectPrimitive.SelectItem>
  );
});

// ------------------------------------------------------------------
// Non Interactive Item

export const NonInteractiveItem = React.forwardRef<
  HTMLDivElement,
  WithClassNameArray<{ children: React.ReactNode; className?: string }>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={menuItemClasses(
        `hover:bg-unset hover:border-unset cursor-default ${className}`,
      )}
      ref={ref}
      {...props}
    />
  );
});

// ------------------------------------------------------------------
// ItemCheck

export type ItemCheckProps = SelectPrimitive.SelectItemCheckProps;

export const ItemCheck = SelectPrimitive.SelectItemCheck;

// ------------------------------------------------------------------
// Group

export type GroupProps = SelectPrimitive.SelectGroupProps;

export const Group = SelectPrimitive.SelectGroup;

// ------------------------------------------------------------------
// GroupLabel

export type GroupLabelProps = SelectPrimitive.SelectGroupLabelProps;

export const GroupLabel = SelectPrimitive.SelectGroupLabel;

// ------------------------------------------------------------------
// Label

export type LabelProps = SelectPrimitive.SelectLabelProps;

export const Label = ({ className, ...props }: LabelProps) => {
  return (
    <SelectPrimitive.SelectLabel
      className={labelClasses({ className })}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
// List

export type ListProps = SelectPrimitive.SelectListProps;

export const List = SelectPrimitive.SelectList;

// ------------------------------------------------------------------
// Row

export type RowProps = SelectPrimitive.SelectRowProps;

export const Row = SelectPrimitive.SelectRow;

// ------------------------------------------------------------------
// Separator

export type SeparatorProps = SelectPrimitive.SelectSeparatorProps;

export const Separator = ({ className, ...props }: SeparatorProps) => {
  return (
    <SelectPrimitive.SelectSeparator
      className={separatorClasses({}, [className])}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
// Selection Indicator

export type SelectItemProps = SelectPrimitive.SelectItemCheckProps;

export const SelectItemCheck = ({ className, ...props }: SelectItemProps) => {
  return <SelectPrimitive.SelectItemCheck className={className} {...props} />;
};

export const Content = () => {
  const options = useSelectOptions();

  return (
    <SelectPrimitive.SelectPopover className={menuContainerClasses}>
      {options.map((option) => (
        <Item id={option.id} key={option.id} value={option.id}>
          {option.name}
        </Item>
      ))}
    </SelectPrimitive.SelectPopover>
  );
};
