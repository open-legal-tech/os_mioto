import type * as React from "react";
import { twMerge } from "../tailwind/merge";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge("animate-pulse rounded bg-gray3", className)}
      {...props}
    />
  );
}
