import { extendTailwindMerge } from "tailwind-merge";

const colorScales = [
  "gray",
  "primary",
  "accent",
  "danger",
  "success",
  "warning",
  "info",
  "colorScheme",
];

const textStyles = [
  "extraLargeHeading",
  "largeHeading",
  "mediumHeading",
  "smallHeading",
  "extraSmallHeading",
  "largeText",
  "mediumText",
  "smallText",
  "extraSmallText",
];

const isArbitraryValue = (classPart: string) => /^\[.+\]$/.test(classPart);

export const twMergeConfig = {
  classGroups: {
    colorScheme: colorScales.map((scale) => `colorScheme-${scale}`),
    focusStyles: ["outer-focus", "inner-focus"],
    "font-weight": [
      {
        font: [...textStyles, "weak", "strong", "none"],
      },
    ],
    leading: [
      ...textStyles.map((style) => `leading-${style}`),
      isArbitraryValue,
    ],
    tracking: [
      ...textStyles.map((style) => `tracking-${style}`),
      isArbitraryValue,
    ],
    font: [
      ...textStyles.map((style) => `font-${style}`),
      "font-weak",
      "font-strong",
      "font-none",
      isArbitraryValue,
    ],
    "font-size": textStyles.map((style) => `text-${style}`),
  },
};

export const twMerge = extendTailwindMerge<"colorScheme" | "focusStyles">({
  extend: twMergeConfig,
});
