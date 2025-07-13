import type { ComboboxStore } from "@ariakit/react/combobox";
import type { SelectPopoverProps, SelectStore } from "@ariakit/react/select";
import * as React from "react";
import { badgeClasses } from "../Badge/Badge";
import type { ComboboxGroupLabel } from "../Combobox/ComboboxList";
import { Combobox } from "../Combobox/index";
import { Select } from "../Select/index";
import type { Option, Options, SubOption } from "./index";

declare module "react" {
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.ForwardedRef<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type SelectWithComboboxProps<
  TData = any,
  TValue extends string | string[] = string | string[],
> = {
  promoteOptionId?: string;
  placeholder?: string;
  options: Options<TData>;
  onSelect?: (value?: TValue) => void;
  id?: string;
  value?: TValue;
  renderItem?: (props: {
    item: Option<TData> | SubOption<TData>;
    isPromoted: boolean;
  }) => React.ReactNode;
  ComboboxInput?: (props: {
    store: ComboboxStore;
    className: string;
  }) => ReturnType<typeof Combobox.Input>;
  SelectInput?: (props: {
    valueCombinator: string;
    store: SelectStore;
    id?: string;
    options: Options<TData>;
    maxValueLength?: number;
    renderValue?: Select.InputProps["renderValue"];
    placeholder?: string;
  }) => ReturnType<typeof Select.Input>;
  popoverProps?: Omit<SelectPopoverProps, "store">;
  comboboxListProps?: Omit<
    Combobox.ListProps<TData>,
    | "store"
    | "options"
    | "Item"
    | "GroupItem"
    | "CreateItem"
    | "onSelect"
    | "onCreate"
    | "GroupLabel"
  > & {
    GroupLabel?: (
      props: Parameters<ComboboxGroupLabel>[0] & { store: SelectStore },
    ) => ReturnType<ComboboxGroupLabel>;
  };
} & Pick<
  Select.InputProps,
  "valueCombinator" | "maxValueLength" | "renderValue"
> &
  Omit<Combobox.ListProps, "onSelect" | "store">;

export const SelectWithCombobox = React.forwardRef(function SelectWithCombobox<
  TData,
  TValue extends string | string[] = string | string[],
>(
  {
    options,
    value,
    onSelect,
    id,
    valueCombinator = "___",
    renderItem,
    SelectInput,
    ComboboxInput,
    popoverProps,
    comboboxListProps,
    promoteOptionId,
    CreateItem,
    Item,
    GroupItem,
    onCreate,
    maxValueLength,
    renderValue,
    placeholder,
  }: SelectWithComboboxProps<TData, TValue>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const combobox = Combobox.useComboboxStore({ resetValueOnHide: true });
  const select = Select.useSelectStore({
    combobox,
    value: value,
    setValue: (value) => onSelect?.(value as TValue),
  });

  return (
    <>
      {SelectInput?.({
        store: select,
        id,
        valueCombinator,
        renderValue,
        options,
        maxValueLength,
        placeholder,
      }) ?? (
        <Select.Input
          store={select}
          valueCombinator={valueCombinator}
          id={id}
          ref={ref}
          options={options}
          maxValueLength={maxValueLength}
          renderValue={renderValue}
          placeholder={placeholder}
        />
      )}
      <Select.Popover store={select} sameWidth gutter={4} {...popoverProps}>
        {ComboboxInput?.({ store: combobox, className: "m-2" }) ?? (
          <Combobox.Input store={combobox} className="m-2" autoFocus />
        )}
        <Combobox.List<TData>
          store={combobox}
          className="grid nokey"
          options={options}
          promoteOptionId={promoteOptionId}
          CreateItem={
            CreateItem
              ? CreateItem
              : onCreate
                ? ({ value }) => (
                    <Select.Item
                      value={value}
                      onClick={() => onCreate(value)}
                      className={`font-none justify-between`}
                    >
                      {value}
                      <span
                        className={badgeClasses({
                          className: "colorScheme-success",
                        })}
                      >
                        Erstellen
                      </span>
                    </Select.Item>
                  )
                : undefined
          }
          Item={
            Item
              ? Item
              : ({ isPromoted, item, key }) => (
                  <Select.Item
                    value={item.id}
                    className={`justify-between`}
                    key={key}
                  >
                    {renderItem?.({
                      item,
                      isPromoted,
                    }) ?? item.name}
                  </Select.Item>
                )
          }
          GroupItem={
            GroupItem
              ? GroupItem
              : ({ isPromoted, item, key, props: { className } }) => (
                  <Select.Item
                    className={`${className} justify-between`}
                    value={item.id}
                    key={key}
                  >
                    {renderItem?.({
                      item,
                      isPromoted,
                    }) ?? item.name}
                  </Select.Item>
                )
          }
          {...comboboxListProps}
          GroupLabel={(props) =>
            comboboxListProps?.GroupLabel?.({ store: select, ...props })
          }
        />
      </Select.Popover>
    </>
  );
});
