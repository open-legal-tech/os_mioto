"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { overlayClasses } from "../shared/overlayClasses";
import { twMerge } from "../tailwind/merge";

// ------------------------------------------------------------------
// Root

export type RootProps = Collapsible.CollapsibleProps;

export const Root = Collapsible.Root;

// ------------------------------------------------------------------
// Trigger

const triggerClasses = "bg-transparent border-none";

export type TriggerProps = Collapsible.CollapsibleTriggerProps;

export const Trigger = ({ children, className, ...props }: TriggerProps) => {
  return (
    <Collapsible.Trigger
      className={
        className ? twMerge(triggerClasses, className) : triggerClasses
      }
      {...props}
    >
      {children}
    </Collapsible.Trigger>
  );
};

// ------------------------------------------------------------------
// Content

export type ContentProps = Collapsible.CollapsibleContentProps;

export const Content = ({ children, className, ...props }: ContentProps) => {
  return (
    <Collapsible.Content
      className={className ? twMerge("bg-white", className) : overlayClasses}
      {...props}
    >
      {children}
    </Collapsible.Content>
  );
};
