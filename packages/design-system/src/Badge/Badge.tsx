import * as React from "react";
import { textClasses } from "../Text/classes";
import { Tooltip } from "../Tooltip";
import { type VariantProps, tv } from "../tailwind/tv";
import { colorScheme, shadow } from "../utils/sharedVariants";

export const badgeClasses = tv({
  base: [
    "rounded-full border-colorScheme6 border text-center colorScheme-primary bg-colorScheme2 flex items-center justify-center gap-1.5 break-keep max-h-max min-w-max",
    "py-1 px-2.5",
    textClasses({ size: "small", className: "leading-[1em]" }),
    "font-weak text-colorScheme9",
  ],

  variants: {
    square: { true: ["aspect-square"] },
    colorScheme,
    shadow,
  },

  defaultVariants: {},
});

export type BadgeVariants = VariantProps<typeof badgeClasses>;

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, colorScheme, square, tooltip, ...props }, ref) => {
    const BaseBadge = React.forwardRef<HTMLSpanElement, BadgeProps>(
      (props, ref) => (
        <span
          ref={ref}
          className={badgeClasses({ colorScheme, square, className })}
          {...props}
        >
          {children}
        </span>
      ),
    );

    return tooltip ? (
      <Tooltip.Root delayDuration={tooltip.delay ?? 300}>
        <Tooltip.Trigger asChild>
          <BaseBadge aria-label={tooltip.content} {...props} ref={ref} />
        </Tooltip.Trigger>
        <Tooltip.Content {...tooltip} />
      </Tooltip.Root>
    ) : (
      <BaseBadge {...props} ref={ref} />
    );
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  BadgeVariants & {
    tooltip?: { delay?: number } & Tooltip.ContentProps;
  };
