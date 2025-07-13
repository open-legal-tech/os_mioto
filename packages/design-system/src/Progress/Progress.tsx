"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";
import { twMerge } from "../tailwind/merge";

export type ProgressProps = React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> & { indicatorClassName?: string; isLoading?: boolean };

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={`${twMerge(
      "relative h-1.5 overflow-hidden rounded-[2.5px] colorScheme-gray bg-colorScheme4",
      className,
    )} progress-container`}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={`h-full w-full flex-1 bg-colorScheme9 transition-all ${indicatorClassName} progress-indicator`}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
