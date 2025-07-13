import { type ClassProp as TVClassProp, createTV } from "tailwind-variants";
import { twMergeConfig } from "./merge";

export type { VariantProps } from "tailwind-variants";
export type ClassProp = Omit<TVClassProp, "class">;

export const tv = createTV({
  twMergeConfig,
});
