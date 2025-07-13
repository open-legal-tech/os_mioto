import { type VariantProps, tv } from "../tailwind/tv";
import { emphasize } from "../utils/sharedVariants";

export const textClasses = tv({
  base: "break-words text-gray10 font-text",
  variants: {
    size: {
      small:
        "text-smallText tracking-smallText font-smallText leading-smallText",
      medium:
        "text-mediumText tracking-mediumText font-mediumText leading-mediumText",
      large:
        "text-largeText tracking-largeText font-largeText leading-largeText",
      inherit: "text-inherit tracking-inherit font-inherit leading-inherit",
    },
    emphasize,
  },

  defaultVariants: {
    size: "medium",
  },
});

export type TextVariants = VariantProps<typeof textClasses>;
