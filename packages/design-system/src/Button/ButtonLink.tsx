"use client";

import * as React from "react";
import Link, { type LinkProps } from "../Link";
import { Tooltip } from "../Tooltip";
import { VisuallyHidden } from "../VisuallyHidden";
import { type ButtonVariants, buttonClasses } from "./classes";

export type ButtonLinkProps = ButtonVariants &
  Omit<LinkProps, "emphasize"> & {
    tooltip?: {
      delay?: number;
    } & Tooltip.ContentProps;
  };

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
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
      tooltip,
      isLoading,
      ...props
    },
    ref,
  ) => {
    const Base = (
      <Link
        ghost
        ref={ref}
        className={buttonClasses({
          round,
          size,
          square,
          variant,
          alignByContent,
          colorScheme,
          emphasize,
          className,
          isLoading,
        })}
        {...props}
      >
        {children}
        {tooltip?.children ? (
          <VisuallyHidden>{tooltip.children}</VisuallyHidden>
        ) : null}
      </Link>
    );

    return tooltip ? (
      <Tooltip.Root delayDuration={tooltip.delay ?? 0}>
        <Tooltip.Trigger asChild>{Base}</Tooltip.Trigger>
        <Tooltip.Content {...tooltip} />
      </Tooltip.Root>
    ) : (
      Base
    );
  },
);
