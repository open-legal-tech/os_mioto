"use client";

import { CaretDown, CaretRight, Check } from "@phosphor-icons/react/dist/ssr";
import * as DropdownMenuPrimitives from "@radix-ui/react-dropdown-menu";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as React from "react";
import { omit } from "remeda";
import { type ButtonVariants, buttonClasses } from "../Button";
import Link, { type BaseLinkProps, type LinkTypes } from "../Link";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { Row } from "../Row";
import { separatorClasses } from "../Separator/Separator";
import { Tooltip } from "../Tooltip";
import {
  dropdownItemStyles,
  menuContainerClasses,
  menuLabelClasses,
} from "../shared/menuClasses";
import { twMerge } from "../tailwind/merge";

const useAsyncHandler = <
  TAsyncHandler extends (...params: any) => Promise<any>,
  TSyncHandler extends (...params: any) => any,
>({
  disabled,
  onAsync,
  onSync,
  onAfterAsync,
}: {
  disabled?: boolean;
  onAsync?: TAsyncHandler;
  onAfterAsync?: () => void | Promise<void>;
  onSync?: TSyncHandler;
}) => {
  const { close } = useDropdownMenuContext();
  const [isPending, startTransition] = React.useTransition();

  return [
    isPending,
    function asyncHandler(event: Event) {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (onAsync) {
        event.preventDefault();
        startTransition(async () => {
          await onAsync({ event, close });
          await onAfterAsync?.();
        });
      } else {
        onSync?.(event);
      }
    },
  ] as const;
};

const DropdownMenuContext = React.createContext<null | {
  open?: boolean;
  close: () => void;
}>(null);
const useDropdownMenuContext = () => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      "DropdownMenu compound components cannot be rendered outside the DropdownMenu component",
    );
  }
  return context;
};

// ------------------------------------------------------------------
// Root

export type RootProps = DropdownMenuPrimitives.DropdownMenuProps;

export const Root = ({
  children,
  modal = false,
  open: incomingOpen,
  onOpenChange,
  defaultOpen,
  ...props
}: RootProps) => {
  const [open, setOpen] = useControllableState({
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    prop: incomingOpen,
  });

  return (
    <DropdownMenuContext.Provider value={{ open, close: () => setOpen(false) }}>
      <DropdownMenuPrimitives.Root
        {...props}
        open={open}
        onOpenChange={setOpen}
        modal={modal}
      >
        {children}
      </DropdownMenuPrimitives.Root>
    </DropdownMenuContext.Provider>
  );
};

// ------------------------------------------------------------------
// Trigger

export type TriggerProps = DropdownMenuPrimitives.DropdownMenuTriggerProps;
export const Trigger = DropdownMenuPrimitives.Trigger;

// ------------------------------------------------------------------
// SubTrigger

export type SubTriggerItemProps =
  DropdownMenuPrimitives.DropdownMenuSubTriggerProps & {
    Icon?: React.ReactNode;
  };

export const SubTriggerItem = ({
  children,
  className,
  Icon = null,
  ...props
}: SubTriggerItemProps) => (
  <DropdownMenuPrimitives.SubTrigger
    className={dropdownItemStyles({ className })}
    {...props}
  >
    {Icon}
    {children}
    <CaretRight className="ml-auto" />
  </DropdownMenuPrimitives.SubTrigger>
);

// ------------------------------------------------------------------
// Item

export type ItemProps = Omit<
  DropdownMenuPrimitives.DropdownMenuItemProps,
  "disabled"
> & {
  Icon?: React.ReactNode;
  disabled?: {
    reason: string;
    tooltip?: { delay?: number } & Tooltip.ContentProps;
  };
} & (
    | {
        isLoading?: boolean;
        onAsyncSelect?: (params: {
          event: Event;
          close: () => void;
        }) => Promise<void>;
      }
    | (Omit<BaseLinkProps, "onSelect"> & LinkTypes)
  );

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, children, Icon = null, disabled, onSelect, ...props }, ref) => {
    if ("href" in props) {
      return (
        <DropdownMenuPrimitives.Item
          ref={ref}
          aria-disabled={!!disabled}
          onSelect={onSelect}
          asChild
          {...props}
        >
          <Link ghost className={dropdownItemStyles({ className })} {...props}>
            {Icon}
            {children}
          </Link>
        </DropdownMenuPrimitives.Item>
      );
    }

    const loadingProps = props.isLoading
      ? ({ "aria-busy": "true", "aria-live": "polite" } as const)
      : {};

    const [isPending, asyncHandler] = useAsyncHandler({
      disabled: !!disabled,
      onAsync: props.onAsyncSelect,
      onSync: onSelect,
    });

    const isLoading = props.isLoading || isPending;

    const clonedChildren = React.isValidElement(children)
      ? React.cloneElement(
          children,
          children.props as any,
          <>
            {isLoading ? <LoadingSpinner /> : (Icon ?? null)}
            {(children.props as any)?.children}
          </>,
        )
      : undefined;

    const Base = (
      <DropdownMenuPrimitives.Item
        ref={ref}
        className={dropdownItemStyles({ className })}
        onSelect={asyncHandler}
        aria-disabled={!!disabled}
        {...loadingProps}
        {...omit(props, ["onAsyncSelect"])}
      >
        {clonedChildren ?? (
          <>
            {isLoading ? <LoadingSpinner /> : Icon ?? null}
            {children}
          </>
        )}
      </DropdownMenuPrimitives.Item>
    );

    return disabled ? (
      <Tooltip.Root delayDuration={disabled.tooltip?.delay ?? 300}>
        <Tooltip.Trigger asChild>{Base}</Tooltip.Trigger>
        <Tooltip.Content side="right" {...disabled.tooltip}>
          {disabled.reason}
        </Tooltip.Content>
      </Tooltip.Root>
    ) : (
      Base
    );
  },
);

// ------------------------------------------------------------------
// CheckboxItem
type IndicatorProps = { children?: React.ReactNode };

const ItemIndicator = ({ children }: IndicatorProps) => {
  return (
    <DropdownMenuPrimitives.ItemIndicator asChild>
      {children ? children : <Check alt="Checked" />}
    </DropdownMenuPrimitives.ItemIndicator>
  );
};

type CheckboxItemProps =
  DropdownMenuPrimitives.DropdownMenuCheckboxItemProps & {
    Icon?: React.ReactNode;
  };

export const CheckboxItem = ({
  children,
  Icon,
  className,
  ...props
}: CheckboxItemProps) => {
  return (
    <DropdownMenuPrimitives.CheckboxItem
      className={dropdownItemStyles({ className })}
      {...props}
    >
      {children}
      <ItemIndicator>{Icon}</ItemIndicator>
    </DropdownMenuPrimitives.CheckboxItem>
  );
};

// ------------------------------------------------------------------
// RadioGroup

export type RadioGroupProps<TValues extends string> = Omit<
  DropdownMenuPrimitives.DropdownMenuRadioGroupProps,
  "children" | "onValueChange"
> & {
  onAsyncValueChange?: (value: NoInfer<TValues>) => Promise<void>;
  onValueChange?: (value: NoInfer<TValues>) => void;
  items: { value: TValues; label: string; Icon?: React.ReactNode }[];
  itemClassName?: string;
};

export const RadioGroup = <TValues extends string>({
  onValueChange,
  onAsyncValueChange,
  items,
  itemClassName,
  ...props
}: RadioGroupProps<TValues>) => {
  const [isPending, startTransition] = React.useTransition();
  const [clickedItem, setClickedItem] = React.useState<TValues | null>(null);

  const changeHandler = (value: TValues) => {
    if (onAsyncValueChange) {
      startTransition(async () => {
        await onAsyncValueChange(value);
      });
    } else {
      onValueChange?.(value);
    }
  };

  return (
    <DropdownMenuPrimitives.RadioGroup
      onValueChange={(value) => changeHandler(value as TValues)}
      {...props}
    >
      {items.map(({ value, label, Icon }) => (
        <DropdownMenuPrimitives.RadioItem
          key={value}
          onSelect={(event) => {
            if (onAsyncValueChange) {
              event.preventDefault();
            }
            setClickedItem(value);
          }}
          className={dropdownItemStyles({
            className: `${itemClassName} justify-between`,
          })}
          value={value}
        >
          <Row className="gap-2">
            {Icon}
            {label}
          </Row>
          {isPending && clickedItem === value ? (
            <LoadingSpinner />
          ) : (
            <DropdownMenuPrimitives.ItemIndicator>
              <Check />
            </DropdownMenuPrimitives.ItemIndicator>
          )}
        </DropdownMenuPrimitives.RadioItem>
      ))}
    </DropdownMenuPrimitives.RadioGroup>
  );
};

// ------------------------------------------------------------------
// RadioItem

export type RadioItemProps =
  DropdownMenuPrimitives.DropdownMenuRadioItemProps & {
    Icon?: React.ReactNode;
  };

export const RadioItem = ({
  children,
  Icon,
  className,
  ...props
}: RadioItemProps) => {
  return (
    <DropdownMenuPrimitives.RadioItem
      className={dropdownItemStyles({ className })}
      {...props}
    >
      {Icon}
      {children}
      <DropdownMenuPrimitives.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <Check />
      </DropdownMenuPrimitives.ItemIndicator>
    </DropdownMenuPrimitives.RadioItem>
  );
};

// ------------------------------------------------------------------
// DropdownButton

const dropdownButtonClasses = "gap-1 group";
const dropdownRotatingIndicatorClasses =
  "p-0 group-data-state-open:rotate-180 transition-transform duration-200 ease-in-out";

export type ButtonProps = TriggerProps &
  ButtonVariants & { withCaret?: boolean };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      size,
      variant,
      square,
      round,
      alignByContent,
      colorScheme,
      className,
      withCaret = true,
      ...props
    },
    ref,
  ) => {
    return (
      <Trigger asChild>
        <button
          className={buttonClasses({
            round,
            size,
            variant,
            square,
            alignByContent,
            colorScheme,
            className: `${dropdownButtonClasses} ${className}`,
          })}
          ref={ref}
          {...props}
        >
          {children}
          {withCaret ? (
            <CaretDown className={dropdownRotatingIndicatorClasses} />
          ) : null}
        </button>
      </Trigger>
    );
  },
);

// ------------------------------------------------------------------
// Portal

export type PortalProps = DropdownMenuPrimitives.DropdownMenuPortalProps;

export const Portal = DropdownMenuPrimitives.Portal;

// ------------------------------------------------------------------
// Content

export type ContentProps = DropdownMenuPrimitives.DropdownMenuContentProps;

export const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ className, children, hidden, sideOffset, ...props }, ref) => {
    return (
      <DropdownMenuPrimitives.Portal>
        <DropdownMenuPrimitives.Content
          className={
            !hidden ? twMerge(menuContainerClasses, className) : undefined
          }
          hidden={hidden}
          sideOffset={sideOffset}
          ref={ref}
          {...props}
        >
          {children}
        </DropdownMenuPrimitives.Content>
      </DropdownMenuPrimitives.Portal>
    );
  },
);

// ------------------------------------------------------------------
// SubContent

export const SubContent = ({
  className,
  children,
  hidden,
  sideOffset = 10,
  ...props
}: ContentProps) => {
  return (
    <DropdownMenuPrimitives.SubContent
      className={!hidden ? twMerge(menuContainerClasses, className) : undefined}
      sideOffset={sideOffset}
      hidden={hidden}
      {...props}
    >
      {children}
    </DropdownMenuPrimitives.SubContent>
  );
};

// ------------------------------------------------------------------
// Label

export type LabelProps = DropdownMenuPrimitives.DropdownMenuLabelProps;

export const Label = ({ className, children, ...props }: LabelProps) => {
  return (
    <DropdownMenuPrimitives.Label
      className={menuLabelClasses(className)}
      {...props}
    >
      {children}
    </DropdownMenuPrimitives.Label>
  );
};

// ------------------------------------------------------------------
// Sub
export type SubProps = DropdownMenuPrimitives.DropdownMenuSubProps;

export const Sub = DropdownMenuPrimitives.Sub;

// ------------------------------------------------------------------
// Separator

export type SeparatorProps = DropdownMenuPrimitives.DropdownMenuSeparatorProps;

export const Separator = ({ className, ...props }: SeparatorProps) => {
  return (
    <DropdownMenuPrimitives.Separator
      className={separatorClasses({}, [className])}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
