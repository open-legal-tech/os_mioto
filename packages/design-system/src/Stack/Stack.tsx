import * as React from "react";
import { twMerge } from "../tailwind/merge";
import { type VariantProps, tv } from "../tailwind/tv";
import type { ClassNameValue, WithClassNameArray } from "../utils/types";

const stack = tv({
  base: "flex flex-col",
  variants: {
    center: {
      true: "items-center justify-center",
    },
  },

  defaultVariants: {
    center: false,
  },
});

export type StackVariants = VariantProps<typeof stack>;

export const stackClasses = (
  variants?: StackVariants,
  classNames?: ClassNameValue[] | ClassNameValue,
) => (classNames ? twMerge(stack(variants), classNames) : stack(variants));

export type StackProps = StackVariants &
  WithClassNameArray<React.HTMLAttributes<HTMLDivElement>>;

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, center, ...props }, ref) => {
    return (
      <div
        className={stackClasses({ center }, [className])}
        {...props}
        ref={ref}
      />
    );
  },
);
