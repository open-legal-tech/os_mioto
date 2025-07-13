"use client";

import { Check } from "@phosphor-icons/react/dist/ssr";
import * as Toggle from "@radix-ui/react-toggle";
import * as React from "react";
import { Button, type ButtonProps } from "../Button/index";

export type ToggleButtonProps = Toggle.ToggleProps &
  ButtonProps & {
    withCheck?: boolean;
  };

export const ToggleButton = React.forwardRef<
  HTMLButtonElement,
  ToggleButtonProps
>(
  (
    {
      children,
      pressed,
      defaultPressed,
      onPressedChange,
      withCheck = false,
      variant = "tertiary",
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <Toggle.Root
        asChild
        pressed={pressed}
        defaultPressed={defaultPressed}
        onPressedChange={onPressedChange}
      >
        <Button
          variant={variant}
          className={className}
          size="small"
          ref={ref}
          {...props}
        >
          {withCheck && pressed ? <Check /> : null}
          {children}
        </Button>
      </Toggle.Root>
    );
  },
);
