"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { stackClasses } from "../Stack/index";
import { arrowClasses, overlayClasses } from "../shared/overlayClasses";
import { twMerge } from "../tailwind/merge";

export const TooltipProvider = TooltipPrimitive.TooltipProvider;

// ------------------------------------------------------------------
// Root

export type RootProps = TooltipPrimitive.TooltipProps;

export const Root = ({ children, ...props }: RootProps) => (
  <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>
);

// ------------------------------------------------------------------
// Content

const contentClasses = twMerge(
  stackClasses({}),
  overlayClasses,
  "py-1 bg-gray10 border-none mediumText align-center max-w-[400px] gap-1 origin-[var(--radix-tooltip-content-transform-origin)] animate-scaleIn text-white font-weak",
);

export type ContentProps = TooltipPrimitive.TooltipContentProps;

export const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ className, style, children, ...props }, ref) => {
    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          className={
            className ? twMerge(contentClasses, className) : contentClasses
          }
          sideOffset={10}
          ref={ref}
          style={{ zIndex: 100, ...style }}
          {...props}
        >
          {children}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    );
  },
);

// ------------------------------------------------------------------
// Arrow

export type TooltipArrowProps = TooltipPrimitive.TooltipArrowProps;

export const Arrow = ({ className, ...props }: TooltipArrowProps) => {
  return (
    <TooltipPrimitive.Arrow
      className={className ? twMerge(arrowClasses, className) : arrowClasses}
      {...props}
    />
  );
};

// ------------------------------------------------------------------
// Trigger

export type TriggerProps = TooltipPrimitive.TooltipTriggerProps;

export const Trigger = TooltipPrimitive.Trigger;

// ------------------------------------------------------------------
// Portal

export type PortalProps = TooltipPrimitive.TooltipPortalProps;

export const Portal = TooltipPrimitive.Portal;

export const Provider = TooltipPrimitive.Provider;
