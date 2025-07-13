import type { IconProps } from "@phosphor-icons/react";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { twMerge } from "../tailwind/merge";

export const LoadingSpinner = ({ className, ...props }: IconProps) => (
  <CircleNotch
    aria-label="Lädt"
    className={twMerge("animate-spin", className)}
    {...props}
  />
);
