import type { ColorKeys } from "./types";

export const colorScheme: Record<ColorKeys | "inherit", string> = {
  primary: "colorScheme-primary",
  secondary: "colorScheme-secondary",
  tertiary: "colorScheme-tertiary",
  danger: "colorScheme-danger",
  success: "colorScheme-success",
  warning: "colorScheme-warning",
  info: "colorScheme-info",
  gray: "colorScheme-gray",
  inherit: "colorScheme-inherit",
};

export type TColorScheme = keyof typeof colorScheme;

export const emphasize = {
  weak: "font-weak",
  strong: "font-strong",
  none: "font-none",
};

export const shadow = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};
