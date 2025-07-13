"use client";

import { FatalError } from "@mioto/errors";
import * as ToggleGroupPrimitives from "@radix-ui/react-toggle-group";
import * as React from "react";
import {
  type ButtonProps,
  type ButtonVariants,
  buttonClasses,
} from "../Button/index";
import { twMerge } from "../tailwind/merge";
import { type VariantProps, tv } from "../tailwind/tv";

const container = tv({
  base: "rounded bg-gray3 relative isolate",
  variants: {
    size: {
      padded: " p-1",
      slim: "p-[1px]",
    },
    raised: {
      true: "shadow-sm",
    },
  },

  defaultVariants: {
    raised: false,
    size: "padded",
  },
});

const root = tv({
  base: "inline-flex gap-2 justify-between w-full",
  variants: {
    layout: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
  },
  defaultVariants: {
    layout: "horizontal",
  },
});

export type RootProps = React.ComponentProps<
  typeof ToggleGroupPrimitives.Root
> & {
  className?: string;
  layout?: "vertical" | "horizontal";
} & VariantProps<typeof container>;

type assignActiveNode = (
  itemValue: string,
) => (node: HTMLButtonElement | null) => void;
const ToggleContext = React.createContext<null | {
  assignActiveNode: assignActiveNode;
}>(null);

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ children, value, className, size, layout, raised, ...props }, ref) => {
    const [activeNode, setActiveNode] =
      React.useState<null | HTMLButtonElement>(null);

    const assignActiveNode: assignActiveNode = (itemValue) => (node) => {
      if (node && itemValue === value) {
        setActiveNode(node);
      } else if (value === "") {
        setActiveNode(null);
      }

      return node;
    };

    return (
      <ToggleContext.Provider value={{ assignActiveNode }}>
        <div
          className={twMerge(container({ raised, className, size }))}
          ref={ref}
        >
          {activeNode ? (
            <div
              aria-hidden
              className="absolute transition-all duration-200 ease-in-out flex justify-center items-center"
              style={{
                width: activeNode.offsetWidth,
                height: activeNode.offsetHeight,
                left: activeNode.offsetLeft,
                top: activeNode.offsetTop,
              }}
            >
              <div className="w-full h-full bg-white rounded shadow-md" />
            </div>
          ) : null}
          <ToggleGroupPrimitives.Root className={root({ layout })} {...props}>
            {children}
          </ToggleGroupPrimitives.Root>
        </div>
      </ToggleContext.Provider>
    );
  },
);

export type ToggleItemProps = ToggleGroupPrimitives.ToggleGroupItemProps &
  ButtonVariants;
export type ToggleRootProps = React.ComponentProps<typeof Root>;
export type ToggleButtonProps = ButtonProps;

export const Item = React.forwardRef<HTMLButtonElement, ToggleItemProps>(
  (
    {
      children,
      value,
      className,
      square = false,
      size = "small",
      variant = "ghost",
      ...props
    },
    ref,
  ) => {
    const context = React.useContext(ToggleContext);

    if (!context) throw new FatalError({ code: "missing_context_provider" });

    return (
      <ToggleGroupPrimitives.Item
        className={twMerge(
          buttonClasses({ size, variant, square }),
          "bg-transparent flex-1 z-10 text-center",
          className,
        )}
        ref={(node) => {
          context.assignActiveNode(value)(node);
          if (typeof ref === "function") ref(node);
          if (ref && typeof ref === "object") ref.current = node;
        }}
        value={value}
        {...props}
      >
        {children}
      </ToggleGroupPrimitives.Item>
    );
  },
);
