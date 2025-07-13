import * as RadixToolbar from "@radix-ui/react-toolbar";
import * as React from "react";
import {
  Button as SystemButton,
  type ButtonProps as SystemButtonProps,
} from "../Button/index";
import { separatorClasses } from "../Separator/Separator";
import {
  ToggleButton as SystemToggleButton,
  type ToggleButtonProps,
} from "../ToggleButton/index";
import { ToggleGroup as SystemToggleGroup } from "../ToggleGroup/index";

// ------------------------------------------------------------------
// Root
export type RootProps = RadixToolbar.ToolbarProps;
export const Root = RadixToolbar.Root;

// ------------------------------------------------------------------
// Button
export type ButtonProps = RadixToolbar.ToolbarButtonProps & SystemButtonProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <RadixToolbar.Button asChild>
      <SystemButton
        ref={ref}
        variant="tertiary"
        colorScheme="gray"
        square
        {...props}
      >
        {children}
      </SystemButton>
    </RadixToolbar.Button>
  ),
);

// ------------------------------------------------------------------
// Separator
export type SeparatorProps = RadixToolbar.ToolbarSeparatorProps;
export const Separator = ({
  className,
  orientation,
  ...props
}: SeparatorProps) => {
  return (
    <RadixToolbar.Separator
      className={separatorClasses({ orientation }, [className])}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
// ToggleGroup

export type ToggleGroupProps = React.ComponentProps<
  typeof RadixToolbar.ToggleGroup
> &
  SystemToggleGroup.RootProps;

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ children, layout, raised, className, ...props }, ref) => {
    return (
      <RadixToolbar.ToggleGroup ref={ref} asChild {...props}>
        <SystemToggleGroup.Root
          layout={layout}
          raised={raised}
          className={className}
          {...props}
        >
          {children}
        </SystemToggleGroup.Root>
      </RadixToolbar.ToggleGroup>
    );
  },
);

// ------------------------------------------------------------------
// ToggleItem

export const ToggleItem = React.forwardRef<
  HTMLButtonElement,
  ToggleButtonProps & RadixToolbar.ToolbarToggleItemProps
>(function ToggleItem({ children, ...props }, ref) {
  return (
    <RadixToolbar.ToggleItem asChild {...props}>
      <SystemToggleGroup.Item ref={ref} {...props}>
        {children}
      </SystemToggleGroup.Item>
    </RadixToolbar.ToggleItem>
  );
});

// ------------------------------------------------------------------
// ToggleButton

export type ToggleItemProps = RadixToolbar.ToolbarToggleItemProps;

export const ToggleButton = React.forwardRef<
  HTMLButtonElement,
  ToggleButtonProps & RadixToolbar.ToolbarButtonProps
>(function ToggleButton({ children, ...props }, ref) {
  return (
    <RadixToolbar.Button asChild>
      <SystemToggleButton
        ref={ref}
        variant="tertiary"
        square
        size="medium"
        {...props}
      >
        {children}
      </SystemToggleButton>
    </RadixToolbar.Button>
  );
});
