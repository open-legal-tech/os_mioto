import type { Icon } from "@phosphor-icons/react";
import type * as React from "react";

import type { JSX } from "react";

export type TVariants = "success" | "danger" | "info" | "warning";

export type ActionProps = {
  dismiss: () => void;
};

export type TNotification = {
  id: string;
  key?: string;
  variant?: TVariants;
  Title: React.ReactNode | string;
  Content?: string | (() => JSX.Element);
  duration?: number;
  type?: "foreground" | "background";
  explanation?: () => JSX.Element | null;
  actions?: ({ dismiss }: ActionProps) => JSX.Element | null;
  customIcon?:
    | ((...params: any) => JSX.Element)
    | React.ForwardRefExoticComponent<React.RefAttributes<SVGSVGElement>>
    | Icon;
};
