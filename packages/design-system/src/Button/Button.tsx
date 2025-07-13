"use client";

import * as React from "react";
import { Tooltip } from "../Tooltip";
import { twMerge } from "../tailwind/merge";
import { type ButtonVariants, buttonClasses } from "./classes";

type BaseButtonProps = React.ComponentPropsWithoutRef<"button"> &
  ButtonVariants;

export type ButtonProps = BaseButtonProps & {
  tooltip?: {
    delay?: number;
  } & Tooltip.ContentProps;
  onAsyncClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
};

export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (
    {
      round,
      size,
      square,
      variant,
      alignByContent,
      colorScheme,
      emphasize,
      className,
      children,
      isLoading,
      focus,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          buttonClasses({
            round,
            size,
            square,
            variant,
            alignByContent,
            colorScheme,
            emphasize,
            isLoading,
            focus,
          }),
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ tooltip, onClick, onAsyncClick, isLoading, ...props }, ref) => {
    const [isPending, startTransition] = React.useTransition();

    const isLoadingOrPending = isLoading || isPending;

    const onClickHandler = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      if (onAsyncClick) {
        startTransition(async () => {
          await onAsyncClick(event);
        });
      } else {
        onClick?.(event);
      }
    };

    return tooltip ? (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <BaseButton
            {...props}
            isLoading={isLoadingOrPending}
            onClick={onClickHandler}
            ref={ref}
          />
        </Tooltip.Trigger>
        <Tooltip.Content {...tooltip} />
      </Tooltip.Root>
    ) : (
      <BaseButton
        {...props}
        isLoading={isLoadingOrPending}
        onClick={onClickHandler}
        ref={ref}
      />
    );
  },
);
