import {
  ComboboxList,
  type ComboboxListProps,
  type ComboboxStore,
} from "@ariakit/react/combobox";
import { useTranslations } from "@mioto/locale";
import { flat } from "remeda";
import Separator from "../Separator";
import { menuGroupItemClasses } from "../shared/menuClasses";
import {
  type Option,
  type Options,
  type SubOption,
  isOption,
} from "../shared/options";
import { Group, useMatches } from "./Combobox";
import { GroupLabel as DefaultGroupLabel } from "./ComboboxGroupLabel";
import {
  CreateItem as DefaultCreateItem,
  Item as DefaultItem,
} from "./ComboboxItem";
import { comboxboxListClasses } from "./classes";

type onCreateFn = (value: string) => void;

export type ItemSlot<TData> = (props: {
  item: Option<TData>;
  isPromoted: boolean;
  key: string;
  store: ComboboxStore;
  props: undefined;
}) => React.ReactNode;

export type GroupItemSlot<TData> = (props: {
  item: SubOption<TData>;
  isPromoted: boolean;
  key: string;
  store: ComboboxStore;
  props: {
    className: string;
  };
}) => React.ReactNode;

export type CreateItemSlot = (props: {
  value: string;
  store: ComboboxStore;
}) => React.ReactNode;

export type ComboboxGroupLabel = (group: {
  id: string;
  name: string;
  isPromoted: boolean;
  isSelectable: boolean;
}) => React.ReactNode;

export type ListProps<TData = any> = Omit<
  ComboboxListProps,
  "onSelect" | "store"
> & {
  options: Options<TData>;
  allOptions?: Option<TData>[];
  promoteOptionId?: string;
  GroupLabel?: ComboboxGroupLabel;
  Item?: ItemSlot<TData>;
  GroupItem?: GroupItemSlot<TData>;
  CreateItem?: CreateItemSlot;
  onCreate?: onCreateFn;
  onSelect?: (option: Option<TData> | SubOption<TData>) => void;
  store: ComboboxStore;
};

export function List<TData>({
  store,
  options,
  allOptions,
  onCreate,
  onSelect,
  promoteOptionId,
  GroupLabel,
  CreateItem,
  Item,
  GroupItem,
  className,
  "aria-label": ariaLabel = "Auswahlliste",
}: ListProps<TData>) {
  const t = useTranslations();
  const flattenedOptions = flat(options).filter(
    (option) =>
      option.type !== "group-option" ||
      option.isSelectable ||
      option.subOptions.length > 0,
  );

  const matches = useMatches(store, flattenedOptions, {
    keys: ["name", "subOptions.*.name", "*.groupName"],
    baseSort: (_, b) => {
      return b.item.id === promoteOptionId ||
        ("groupId" in b.item && b.item.groupId === promoteOptionId)
        ? 1
        : -1;
    },
  });

  return (
    <ComboboxList
      store={store}
      className={comboxboxListClasses(className)}
      aria-label={ariaLabel}
    >
      {(() => {
        if (
          !store.getState().value.length ||
          matches.length > 0 ||
          allOptions?.some((option) => option.name === store.getState().value)
        )
          return null;

        if (CreateItem) {
          return (
            <>
              {CreateItem({ value: store.getState().value, store })}
              <Separator />
            </>
          );
        }

        if (onCreate) {
          return (
            <>
              <DefaultCreateItem
                store={store}
                className="my-2"
                onCreate={onCreate}
              >
                {store.getState().value}
              </DefaultCreateItem>
              <Separator />
            </>
          );
        }

        return null;
      })()}

      {matches.length > 0 ? (
        matches.map((item) => {
          if (isOption(item)) {
            return (
              Item?.({
                item,
                isPromoted: item.id === promoteOptionId,
                key: item.id,
                store,
                props: undefined,
              }) ?? (
                <DefaultItem
                  key={item.id}
                  focusOnHover
                  onClick={() => onSelect?.(item)}
                >
                  {item.name}
                </DefaultItem>
              )
            );
          }

          const groupId = item.id;
          const groupName = item.name;

          return (
            <Group key={groupId}>
              {GroupLabel?.({
                id: groupId,
                name: groupName,
                isPromoted: groupId === promoteOptionId,
                isSelectable: item.isSelectable,
              }) ?? <DefaultGroupLabel>{groupName}</DefaultGroupLabel>}

              {item.subOptions.map((match) => {
                return (
                  GroupItem?.({
                    item: match,
                    isPromoted: match.id === promoteOptionId,
                    key: match.id,
                    props: {
                      className: menuGroupItemClasses(),
                    },
                    store,
                  }) ?? (
                    <DefaultItem
                      key={match.id}
                      className={`${menuGroupItemClasses} `}
                      onClick={() => onSelect?.(match)}
                    >
                      {match.name}
                    </DefaultItem>
                  )
                );
              })}
            </Group>
          );
        })
      ) : (
        <DefaultItem store={store} disabled>
          {t("components.select-with-combobox.no-options")}
        </DefaultItem>
      )}
    </ComboboxList>
  );
}
