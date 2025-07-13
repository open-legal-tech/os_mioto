import * as React from "react";
import { rowClasses } from "../Row/index";
import { stackClasses } from "../Stack/index";
import {
  type BaseInputVariants,
  baseInputClasses,
  inputWrapperClasses,
} from "../shared/inputClasses";
import { twMerge } from "../tailwind/merge";
import type { ClassNameValue } from "../utils/types";

// ------------------------------------------------------------------
// Group

const groupClasses = stackClasses({}, ["gap-2"]);

export type GroupProps = React.HTMLAttributes<HTMLDivElement>;

export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={className ? twMerge(groupClasses, className) : groupClasses}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

// ------------------------------------------------------------------
// Item

const radioItemClasses = (
  variants: BaseInputVariants,
  classNames?: ClassNameValue,
) =>
  rowClasses({ center: true }, [
    baseInputClasses(variants),
    inputWrapperClasses,
    `rounded-full appearance-none after:block after:w-[8px] after:h-[8px] after:rounded-full after:m-[4px] after:min-w-max checked:bg-primary2 checked:after:bg-colorScheme7`,
    classNames,
  ]);

export type ItemProps = React.InputHTMLAttributes<HTMLInputElement> &
  BaseInputVariants;

export const Item = React.forwardRef<HTMLInputElement, ItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="radio"
        className={radioItemClasses({}, [className])}
        ref={ref}
        {...props}
      />
    );
  },
);
