import React, { type ForwardedRef } from "react";
import type { LabelProps } from "../Label/Label";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";

export type FileInputProps = {
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  children: React.ReactNode;
  disabled?: boolean;
  Icon?: React.ReactNode;
  accept?: React.InputHTMLAttributes<HTMLInputElement>["accept"];
  type?: "upload" | "download";
  isLoading?: boolean;
  labelProps?: Omit<LabelProps, "onChange">;
} & React.HTMLAttributes<HTMLInputElement>;

/**
 * A custom Form element wrapping the native file input type.
 */
const FileInputImpl = (
  {
    children,
    className,
    onChange,
    disabled,
    accept,
    labelProps,
    isLoading: _,
    ...props
  }: FileInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  return (
    <label className={className} data-disabled={disabled} {...labelProps}>
      {children}
      <VisuallyHidden>
        <input
          type="file"
          onChange={onChange}
          disabled={disabled}
          accept={accept}
          ref={ref}
          {...props}
        />
      </VisuallyHidden>
    </label>
  );
};

export const FileInput = React.forwardRef(FileInputImpl);
