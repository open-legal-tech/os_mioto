import { type VariantProps, tv } from "../tailwind/tv";

export const headingClasses = tv({
  base: "break-words hyphens-auto text-gray10 font-heading",
  variants: {
    size: {
      tiny: "text-tinyHeading font-tinyHeading leading-tinyHeading tracking-tinyHeading",
      "extra-small":
        "text-extraSmallHeading font-extraSmallHeading leading-extraSmallHeading tracking-extraSmallHeading",
      small:
        "text-smallHeading font-smallHeading leading-smallHeading tracking-smallHeading",
      medium:
        "text-mediumHeading font-mediumHeading leading-mediumHeading tracking-mediumHeading",
      large:
        "text-largeHeading font-largeHeading leading-largeHeading tracking-largeHeading",
      "extra-large":
        "text-extraLargeHeading font-extraLargeHeading leading-extraLargeHeading tracking-extraLargeHeading",
      inherit: "text-inherit font-inherit leading-inherit tracking-inherit",
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export type HeadingVariants = VariantProps<typeof headingClasses>;
