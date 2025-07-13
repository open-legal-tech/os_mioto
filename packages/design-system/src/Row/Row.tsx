import * as React from "react";
import { twMerge } from "../tailwind/merge";
import { type VariantProps, tv } from "../tailwind/tv";
import type { ClassNamesProp, WithClassNameArray } from "../utils/types";

const row = tv({
  base: "flex flex-start flex-row",
  variants: {
    center: {
      true: "items-center justify-center",
    },
  },

  defaultVariants: {
    center: false,
  },
});

export type RowVariants = VariantProps<typeof row>;

export const rowClasses = (
  variants?: RowVariants,
  classNames?: ClassNamesProp,
) => (classNames ? twMerge(row(variants), classNames) : row(variants));

export type RowProps = RowVariants &
  WithClassNameArray<React.HTMLAttributes<HTMLDivElement>>;

export const Row = React.forwardRef<HTMLDivElement, RowProps>(
  ({ className, center, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={rowClasses({ center }, [className])}
        {...props}
      />
    );
  },
);
