import * as React from "react";
import { type TextVariants, textClasses } from "./classes";

export type TextProps = React.HTMLAttributes<HTMLParagraphElement> &
  TextVariants;

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, children, size, emphasize, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={textClasses({ size, emphasize, className })}
        {...props}
      >
        {children}
      </p>
    );
  },
);
