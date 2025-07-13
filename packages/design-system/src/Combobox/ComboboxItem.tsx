import { ComboboxItem, type ComboboxItemProps } from "@ariakit/react/combobox";
import * as React from "react";
import { badgeClasses } from "../Badge";
import { Row } from "../Row";
import { menuItemClasses } from "../shared/menuClasses";
import type { WithClassNameArray } from "../utils/types";

export type CreateItemProps = WithClassNameArray<ComboboxItemProps> &
  Required<Pick<ComboboxItemProps, "store">> & {
    onCreate: (value: string) => void;
  };

export const CreateItem = React.forwardRef<HTMLDivElement, CreateItemProps>(
  function CreateItem(
    { className, render, store, children, onCreate, ...props },
    ref,
  ) {
    return (
      <ComboboxItem
        ref={ref}
        key="create"
        className={menuItemClasses(className)}
        focusOnHover
        render={render}
        onClick={() => onCreate(store.getState().value)}
        role="option"
        {...props}
      >
        {typeof children === "string" ? (
          <Row className={`${className} justify-between`} {...props}>
            {store.getState().value}{" "}
            <span
              className={badgeClasses({ className: "colorScheme-success" })}
            >
              Erstellen
            </span>
          </Row>
        ) : (
          children
        )}
      </ComboboxItem>
    );
  },
);

export type ItemProps = WithClassNameArray<ComboboxItemProps>;

export const Item = React.forwardRef(function Item(
  { className, render, children, ...props }: ItemProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <ComboboxItem
      ref={ref}
      className={menuItemClasses(className)}
      focusOnHover
      render={render}
      {...props}
    >
      {typeof children === "string" ? (
        <Row className={`${className} gap-2 flex-1`} {...props}>
          {children}
        </Row>
      ) : (
        children
      )}
    </ComboboxItem>
  );
});
