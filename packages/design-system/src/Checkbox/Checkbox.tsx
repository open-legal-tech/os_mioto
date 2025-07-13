import * as React from "react";
import {
  type BaseInputVariants,
  baseInputClasses,
  inputWrapperClasses,
} from "../shared/inputClasses";
import { twMerge } from "../tailwind/merge";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> &
  BaseInputVariants;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, id, name, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={twMerge(
          baseInputClasses(),
          inputWrapperClasses,
          "rounded p-[2px] accent-primary7 disabled:opacity-80",
          className,
        )}
        id={id ?? name}
        name={name}
        {...props}
      />
    );
  },
);
