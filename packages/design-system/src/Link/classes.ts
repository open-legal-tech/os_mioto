
import { textClasses } from "../Text/classes";
import { type VariantProps, tv } from "../tailwind/tv";

export type LinkVariants = VariantProps<typeof linkClasses>;

export const linkClasses = tv({
  extend: textClasses,
  base: `inline-flex items-center no-underline rounded-sm break-all cursor-pointer gap-1 focus-visible:outer-focus`,
  variants: {
    underline: {
      true: "underline",
    },
    square: {
      true: "aspect-square",
    },
  },
});


