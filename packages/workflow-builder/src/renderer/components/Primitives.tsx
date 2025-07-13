"use client";

import { Form as SystemForm } from "@mioto/design-system/Form";
import { ScrollArea } from "@mioto/design-system/ScrollArea";
import { Stack, stackClasses } from "@mioto/design-system/Stack";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import type { ClassNamesProp } from "@mioto/design-system/utils/types";
import { motion } from "framer-motion";
import type * as React from "react";
import { Navigation } from "./Navigation";
import { RendererContainer } from "./RendererContainer";

export type ContentAreaProps = {
  children: React.ReactNode;
  className?: string;
};

export function ContentArea({ children, className }: ContentAreaProps) {
  return (
    <ScrollArea.Root
      className={twMerge("flex flex-col overflow-hidden", className)}
    >
      <ScrollArea.Viewport>
        <Stack className="gap-6 flex-1">{children}</Stack>
        <ScrollArea.Scrollbar />
      </ScrollArea.Viewport>
    </ScrollArea.Root>
  );
}

export type ContainerProps = {
  children: React.ReactNode;
  withNavigation?: boolean;
  className?: string;
  classNames?: ClassNamesProp;
  successButtonLabel?: React.ReactNode;
  disabled?: boolean;
  canGoForward?: boolean;
  canGoBack?: boolean;
  isInteractive?: boolean;
  isLoading?: boolean;
};

export function Container({
  children,
  withNavigation = true,
  className,
  successButtonLabel,
  classNames,
  disabled,
  canGoForward,
  canGoBack,
  isLoading = false,
}: ContainerProps) {
  return (
    <RendererContainer className={className} classNames={classNames}>
      <motion.div
        className={stackClasses({}, ["flex-1", "mb-8"])}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        {children}
      </motion.div>
      {withNavigation ? (
        <Navigation
          canGoBack={canGoBack ?? true}
          canGoForward={canGoForward ?? true}
          className="self-center"
          successButtonLabel={successButtonLabel}
          disabled={disabled}
          isLoading={isLoading}
        />
      ) : null}
    </RendererContainer>
  );
}

export type FormProps<TFieldValues extends SystemForm.FieldValues> = {
  children?: React.ReactNode;
} & SystemForm.RootProps<TFieldValues> &
  Pick<SystemForm.ProviderProps<TFieldValues>, "methods">;

export function Form<TFieldValues extends SystemForm.FieldValues>({
  children,
  methods,
  ...props
}: FormProps<TFieldValues>) {
  return (
    <SystemForm.Provider methods={methods}>
      <SystemForm.Root className="gap-8 h-full" id="form" {...props}>
        {children}
        <SystemForm.FormError name="root" />
      </SystemForm.Root>
    </SystemForm.Provider>
  );
}
