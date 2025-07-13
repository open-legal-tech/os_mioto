"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { twMerge } from "../tailwind/merge";
import { type VariantProps, tv } from "../tailwind/tv";
import type { ClassNamesProp } from "../utils/types";

const baseClasses = tv({
  base: "bg-gray5 my-1 rounded-full",
  variants: {
    orientation: {
      vertical: "w-[1px] h-full",
      horizontal: "h-[1px] w-full",
    },
  },

  defaultVariants: {
    orientation: "horizontal",
  },
});

export type SeparatorVariants = VariantProps<typeof baseClasses>;

export const separatorClasses = (
  variants?: SeparatorVariants,
  classNames?: ClassNamesProp,
) =>
  classNames
    ? twMerge(baseClasses(variants), classNames)
    : baseClasses(variants);

export type SeparatorProps = SeparatorPrimitive.SeparatorProps &
  SeparatorVariants;

export const Separator = ({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) => {
  return (
    <SeparatorPrimitive.Root
      className={separatorClasses({ orientation }, [className])}
      {...props}
    />
  );
};
