"use client";

import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";
import { twMerge } from "../tailwind/merge";

export const Root = AccordionPrimitive.Root;

export const Item = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={twMerge("border-b overflow-hidden", className)}
    {...props}
  />
));

export const Trigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    containerClassName?: string;
  }
>(({ className, children, containerClassName, ...props }, ref) => (
  <AccordionPrimitive.Header className={`flex ${containerClassName}`}>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={twMerge(
        "flex flex-1 items-center justify-between font-medium transition-all [&[data-state=open]_.rotate]:rotate-180 [&:disabled_.rotate]:opacity-50 gap-2 focus-visible:outer-focus rounded",
        className,
      )}
      {...props}
    >
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

export const Arrow = () => {
  return (
    <CaretDown className="h-4 w-4 transition-transform duration-200 flex-grow-0 rotate" />
  );
};

export const Content = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={twMerge(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down ",
      className,
    )}
    {...props}
  >
    {children}
  </AccordionPrimitive.Content>
));
