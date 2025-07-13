import * as React from "react";
import {
  type BaseInputVariants,
  type TextInputVariants,
  baseInputClasses,
  textInputClasses,
} from "../shared/inputClasses";
import { twMerge } from "../tailwind/merge";

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  BaseInputVariants &
  TextInputVariants;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function Textarea({ size, className, id, name, ...props }, ref) {
    return (
      <textarea
        className={twMerge(
          baseInputClasses({}),
          textInputClasses({ size }),
          "p-2",
          className,
        )}
        ref={ref}
        id={id ?? name}
        name={name}
        {...props}
      />
    );
  },
);
