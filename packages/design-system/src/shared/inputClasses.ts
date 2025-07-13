import { type VariantProps, tv } from "../tailwind/tv";

export const baseInputClasses = tv({
  base: "relative flex items-center focus-within:inner-focus hover:bg-gray2 colorScheme-primary border border-gray6 disabled:opacity-40 rounded bg-gray1 text-gray10",
});

export type BaseInputVariants = VariantProps<typeof baseInputClasses>;

export const textInputClasses = tv({
  base: "rounded text-start",
  variants: {
    size: {
      small: "text-smallText py-2 px-3 md:py-1 md:px-2",
      medium: "text-mediumText py-2 px-3",
      large: "text-largeText py-3 px-4",
    },
    defaultVariants: {
      size: "medium",
    },
  },
});

export type TextInputVariants = VariantProps<typeof textInputClasses>;

export const inputWrapperClasses =
  "flex items-center justify-center text-white checked:bg-colorScheme7 checked:border-colorScheme7 checked:text-colorScheme7";
