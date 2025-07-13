import * as React from "react";

import { Button, type ButtonProps } from "../Button/Button";

export type SubmitButtonProps = ButtonProps & {
  isLoading?: boolean;
};

export const SubmitButton = React.forwardRef<
  HTMLButtonElement,
  SubmitButtonProps
>(function SubmitButton(
  { isLoading = false, children, colorScheme = "primary", className, ...props },
  ref,
) {
  return (
    <Button
      type="submit"
      className={`colorScheme-${colorScheme} ${className}`}
      ref={ref}
      variant="primary"
      disabled={isLoading}
      isLoading={isLoading}
      {...props}
    >
      {children}
    </Button>
  );
});
