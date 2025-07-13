export type WithClassNameArray<TElement> = TElement;

export declare type ClassNameValue =
  | ClassNameArray
  | string
  | null
  | undefined
  | 0
  | false;

declare type ClassNameArray = ClassNameValue[];
export type ClassNamesProp = ClassNameArray | ClassNameValue;

const colorScales = [
  "gray",
  "primary",
  "secondary",
  "tertiary",
  "danger",
  "success",
  "warning",
  "info",
  "colorScheme",
] as const;

export type ColorKeys = Exclude<(typeof colorScales)[number], "colorScheme">;

export type ColorLevels =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10";

type ColorSpectrum<TAlias extends string> = `${TAlias}${ColorLevels}`;

type AllColorsKeys = `${ColorKeys}${ColorLevels}`;

export type SystemColors = Record<AllColorsKeys, string> & {
  shadowColor: string;
  black: string;
  white: string;
  "colorScheme-text": string;
  "colorScheme-bg-opaque-text": string;
};

export const aliasColor = <TAlias extends string>(
  alias: TAlias,
  color: Record<ColorSpectrum<string>, string>,
  bright = false,
): Record<ColorSpectrum<TAlias>, string> => {
  const colors = Object.values<string>(color);

  return {
    [`${alias}1`]: colors[0],
    [`${alias}2`]: colors[1],
    [`${alias}3`]: colors[2],
    [`${alias}4`]: colors[3],
    [`${alias}5`]: colors[4],
    [`${alias}6`]: colors[5],
    [`${alias}7`]: colors[6],
    [`${alias}8`]: colors[7],
    [`${alias}9`]: colors[8],
    [`${alias}10`]: colors[9],
    [`${alias}-text`]: "$colors$colorScheme10",
    [`${alias}-bg-opaque-text`]: bright ? "$colors$black" : "$colors$white",
  } as Record<ColorSpectrum<TAlias>, string>;
};

export type TextStyles =
  | "extraLargeHeading"
  | "largeHeading"
  | "mediumHeading"
  | "smallHeading"
  | "extraSmallHeading"
  | "largeText"
  | "mediumText"
  | "smallText"
  | "extraSmallText";

export type RenderProp<P> = (props: P) => React.ReactNode;
