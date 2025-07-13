import { textClasses } from "../Text/classes";
import { type VariantProps, tv as className } from "../tailwind/tv";
import { colorScheme } from "../utils/sharedVariants";

export const buttonClasses = className({
  base: "flex justify-center transition-colors cursor-pointer appearance-none rounded disabled:cursor-not-allowed disabled:opacity-50 items-center outline-none",
  variants: {
    focus: {
      outer: "focus-visible:ring-2 focus-visible:ring-primary6",
      inner: "focus-visible:border-primary6",
    },
    size: {
      small: [
        "py-1.5",
        "px-1.5",
        "gap-1",
        textClasses({
          size: "small",
          emphasize: "weak",
          className: "leading-[1em] text-colorScheme10",
        }),
      ],
      medium: [
        "px-3",
        "py-2.5",
        "gap-2",
        textClasses({
          size: "medium",
          emphasize: "weak",
          className: "leading-[1em] text-colorScheme10",
        }),
      ],
    },
    square: { true: ["aspect-square"] },
    round: { true: ["rounded-full"] },
    emphasize: { true: [] },
    variant: {
      primary: [
        "colorScheme-primary",
        "bg-colorScheme3",
        "hover:bg-colorScheme4",
        "active:bg-colorScheme5",
        "border",
        "border-colorScheme6",
      ],
      secondary: [
        "colorScheme-primary",
        "bg-colorScheme1",
        "hover:bg-colorScheme2",
        "active:bg-colorScheme3",
        "border",
        "border-colorScheme6",
      ],
      tertiary: [
        "colorScheme-gray",
        "bg-transparent",
        "border-transparent",
        "hover:bg-colorScheme2",
        "active:bg-colorScheme3",
        "border",
        "hover:border-colorScheme6",
        "active:border-colorScheme6",
      ],
      ghost: ["bg-[unset]", "border", "border-transparent"],
    },
    alignByContent: {
      left: "",
      right: "",
    },
    colorScheme,
    isLoading: {
      true: ["animate-pulse"],
    },
  },

  compoundVariants: [
    {
      size: "small",
      square: true,
      className: ["p-1.5"],
    },
    {
      size: "medium",
      square: true,
      className: ["p-2.5"],
    },
    {
      alignByContent: "left",
      size: "small",
      className: ["translate-x-[calc((var(--space2)+1px)*-1)]"],
    },
    {
      alignByContent: "left",
      size: "medium",
      className: ["translate-x-[calc((var(--space3)+1px)*-1)]"],
    },
    {
      alignByContent: "right",
      size: "small",
      className: ["translate-x-[calc(var(--space2)+1px)]"],
    },
    {
      alignByContent: "right",
      size: "medium",
      className: ["translate-x-[calc(var(--space3)+1px)]"],
    },
    {
      variant: ["primary", "secondary", "tertiary", "ghost"],
      emphasize: true,
      className: [
        "border-2 border-colorScheme10 shadow-[4px_4px_0px_#141415] active:shadow-none transition-shadow",
      ],
    },
  ],

  defaultVariants: {
    focus: "outer",
    variant: "primary",
    size: "medium",
  },
});

export type ButtonVariants = VariantProps<typeof buttonClasses>;
