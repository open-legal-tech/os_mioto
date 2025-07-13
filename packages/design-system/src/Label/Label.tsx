import * as React from "react";
import { type TextVariants, textClasses } from "../Text/classes";
import { twMerge } from "../tailwind/merge";
import { type VariantProps, tv } from "../tailwind/tv";

const labelVariantClasses = tv({
  variants: {
    emphasize: {
      weak: "font-weak",
      strong: "font-strong",
      none: "font-none",
    },
  },
});

export type LabelVariants = VariantProps<typeof labelVariantClasses> &
  TextVariants;

export const labelClasses = ({
  size,
  emphasize,
  className,
}: TextVariants & { className?: string }) =>
  twMerge(
    textClasses({ size }),
    labelVariantClasses({ emphasize }),
    "inline-flex items-center gap-2 disabled:text-gray9",
    className,
  );

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> &
  LabelVariants;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, size, ...props }, ref) => {
    return (
      <label className={labelClasses({ size, className })} ref={ref} {...props}>
        {children}
      </label>
    );
  },
);
