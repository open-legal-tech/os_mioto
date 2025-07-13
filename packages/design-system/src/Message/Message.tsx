import type * as React from "react";

import { type TextVariants, textClasses } from "../Text/classes";
import { twMerge } from "../tailwind/merge";
import { type VariantProps, tv } from "../tailwind/tv";
import { colorScheme } from "../utils/sharedVariants";
import type { ClassNameValue } from "../utils/types";

const baseClasses = tv({
  base: "text-colorScheme9 bg-colorScheme2 rounded max-w-max empty:hidden border border-colorScheme5",
  variants: {
    size: {
      small: "p-1",
      medium: "p-2",
      large: "p-3",
    },
    colorScheme: colorScheme,
  },
  defaultVariants: {
    colorScheme: "danger",
    size: "medium",
  },
});

export type MessageVariants = TextVariants & VariantProps<typeof baseClasses>;

export const messageClasses = (
  { size, colorScheme }: MessageVariants,
  classNames?: ClassNameValue[],
) =>
  twMerge(
    textClasses({ size }),
    baseClasses({ colorScheme, size }),
    classNames,
  );

export const Message = ({
  className,
  size,
  children,
  colorScheme,
  ...props
}: MessageProps) => {
  return (
    <div
      role="alert"
      className={messageClasses({ size, colorScheme }, [className])}
      {...props}
    >
      {children}
    </div>
  );
};

export type MessageProps = React.HTMLAttributes<HTMLDivElement> &
  MessageVariants;
