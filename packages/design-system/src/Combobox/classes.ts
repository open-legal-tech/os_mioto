import { twMerge } from "../tailwind/merge";
import type { ClassNamesProp } from "../utils/types";

export const comboxboxListClasses = (classNames?: ClassNamesProp) =>
  twMerge(
    "max-h-[min(calc(var(--popover-available-height)-100px),_320px)] overflow-y-auto nokey flex flex-col",
    classNames,
  );
