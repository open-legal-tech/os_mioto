"use client";

import React from "react";
import { Button, type ButtonProps } from "../Button";
import { LoadingSpinner } from "../LoadingSpinner";
import { VisuallyHidden } from "../VisuallyHidden";

export type IconButtonProps = ButtonProps &
  Required<Pick<ButtonProps, "tooltip">>;

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size, children, tooltip, isLoading, ...props }, ref) => {
    const [showLoading, setShowLoading] = React.useState(false);

    React.useEffect(() => {
      if (isLoading) {
        const timeout = setTimeout(() => {
          setShowLoading(true);
        }, 200);
        return () => clearTimeout(timeout);
      }
      setShowLoading(false);
      return;
    }, [isLoading]);

    return (
      <Button
        size={size}
        square
        variant="tertiary"
        tooltip={tooltip}
        ref={ref}
        {...props}
      >
        {isLoading && showLoading ? <LoadingSpinner size="1em" /> : children}
        {tooltip?.children ? (
          <VisuallyHidden>{tooltip.children}</VisuallyHidden>
        ) : null}
      </Button>
    );
  },
);
