"use client";;
import * as React from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import {
  type BaseInputVariants,
  type TextInputVariants,
  baseInputClasses,
  textInputClasses,
} from "../shared/inputClasses";
import { twMerge } from "../tailwind/merge";
import type { WithClassNameArray } from "../utils/types";

import type { JSX } from "react";

export { baseInputClasses, textInputClasses };

export type InputProps = {
  Button?: JSX.Element;
  LeftButton?: JSX.Element;
  Icon?: ({ className }: { className: string }) => React.ReactNode;
  disabled?: boolean;
  inputClassNames?: string;
  isLoading?: boolean;
} & WithClassNameArray<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">
> &
  BaseInputVariants &
  TextInputVariants;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      disabled,
      size = "medium",
      Icon,
      className,
      inputClassNames,
      name,
      id,
      Button,
      LeftButton,
      isLoading,
      ...props
    },
    ref,
  ) {
    return (
      <div
        className={twMerge(baseInputClasses(), className)}
        {...(disabled ? { "data-disabled": true } : {})}
      >
        {LeftButton ? (
          <span
            className={twMerge(
              textInputClasses({ size }),
              "flex items-center pr-0",
            )}
          >
            {LeftButton}
          </span>
        ) : null}
        {Icon?.({ className: "text-gray9 absolute ml-3" })}
        <input
          className={twMerge(
            textInputClasses({ size }),
            "w-full min-w-0 outline-none bg-transparent border-none",
            inputClassNames,
          )}
          ref={ref}
          disabled={disabled}
          style={{
            paddingLeft: Icon ? "calc(var(--space3) * 2 + 1em)" : undefined,
          }}
          name={name}
          id={id ?? name}
          {...props}
        />
        {isLoading ? (
          <span className={twMerge("flex items-center pl-0 py-1 px-2")}>
            <LoadingSpinner />
          </span>
        ) : Button ? (
          <span className={twMerge("flex items-center pl-0 py-1 px-2")}>
            {Button}
          </span>
        ) : null}
      </div>
    );
  },
);
