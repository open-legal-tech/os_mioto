import { Stack } from "@mioto/design-system/Stack";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import type { ClassNamesProp } from "@mioto/design-system/utils/types";

export function RendererContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  classNames?: ClassNamesProp;
  className?: string;
}) {
  return (
    <Stack center className="renderer-theme h-full renderer-container">
      <div
        className={twMerge(
          "grid grid-rows-[1fr_max-content] grid-cols-[minmax(100%,_700px)] h-full",
        )}
      >
        <Stack
          className={`rounded w-full justify-self-center justify-between ${className}`}
        >
          {children}
        </Stack>
      </div>
      <div data-iframe-height />
    </Stack>
  );
}
