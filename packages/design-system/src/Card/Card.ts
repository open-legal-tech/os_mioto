import { twMerge } from "../tailwind/merge";
import type { ClassNamesProp } from "../utils/types";

export const cardClasses = (classNames?: ClassNamesProp) =>
  twMerge([
    "p-4 border border-gray5 rounded bg-white focus-visible:inner-focus",
    classNames,
  ]);

export const sidebarCardClasses = (classNames?: ClassNamesProp) =>
  twMerge("bg-white border border-gray5 rounded", classNames);

export const sidebarCardBottomClasses = (classNames?: ClassNamesProp) =>
  twMerge("border-t border-gray2 bg-gray1 rounded-b-md", classNames);
