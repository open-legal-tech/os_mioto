"use client";

import { useTranslations } from "@mioto/locale";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import type { Required } from "utility-types";
import { Button, type ButtonProps } from "../Button";
import Heading from "../Heading";
import type { HeadingVariants } from "../Heading/classes";
import { Row } from "../Row";
import { Stack } from "../Stack";
import { type TextVariants, textClasses } from "../Text/classes";
import { twMerge } from "../tailwind/merge";
import { type VariantProps, tv } from "../tailwind/tv";
import { dialogClasses } from "./classes";

const overlayStyles = tv({
  base: "fixed top-0 left-0 w-full h-full isolate z-20 bg-black/30 flex items-center justify-center p-4 text-center backdrop-blur-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
});

const modalStyles = tv({
  base: "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
});

const DialogContext = React.createContext<{
  classes: ReturnType<typeof dialogClasses>;
  close: () => void;
} | null>(null);

const useDialogContext = () => {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw new Error(
      "Dialog compound components cannot be rendered outside the Dialog component",
    );
  }

  return context;
};

export type DialogRootProps = Required<
  DialogPrimitive.DialogProps,
  "open" | "onOpenChange"
> &
  VariantProps<typeof dialogClasses>;

const DialogRoot = ({
  children,
  destructive,
  open,
  onOpenChange,
  ...props
}: DialogRootProps) => (
  <DialogContext.Provider
    value={{
      classes: dialogClasses({ destructive }),
      close: () => onOpenChange?.(false),
    }}
  >
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
      {children}
    </DialogPrimitive.Root>
  </DialogContext.Provider>
);

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={overlayStyles({ className })}
    {...props}
  />
));

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const {
    classes: { card },
  } = useDialogContext();

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={modalStyles({ className: card({ className }) })}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

const DialogHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <Row
    className={twMerge("items-center justify-between gap-2", className)}
    {...props}
  >
    {children}
  </Row>
);

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & HeadingVariants
>(({ children, className, ...props }, ref) => {
  const {
    classes: { heading },
  } = useDialogContext();
  return (
    <DialogPrimitive.Title ref={ref} asChild {...props}>
      <Heading className={heading({ className })}>{children}</Heading>
    </DialogPrimitive.Title>
  );
});

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> &
    TextVariants
>(({ className, emphasize, size, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={textClasses({ className, emphasize, size })}
    {...props}
  />
));

const DialogCloseButton = () => {
  const t = useTranslations();

  return (
    <DialogClose asChild>
      <Button variant="tertiary">{t("components.dialog.close-button")}</Button>
    </DialogClose>
  );
};

const DialogButtonRow = ({
  children,
  className,
  asChild,
  onAsyncClick,
  withCancelButton = true,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
  withCancelButton?: boolean;
} & ButtonProps) => {
  const {
    classes: { submit },
    close,
  } = useDialogContext();
  const Comp = asChild ? Slot : Button;

  return (
    <Row className={twMerge("gap-2 self-end", className)}>
      {withCancelButton ? <DialogCloseButton /> : null}
      <Comp
        className={submit()}
        onAsyncClick={onAsyncClick ? async () => close() : undefined}
        {...props}
      >
        {children}
      </Comp>
    </Row>
  );
};

const DialogDefault = ({
  children,
  title,
  ConfirmationButton,
  description,
  withCancelButton,
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  title: string;
  description?: React.ReactNode;
  ConfirmationButton: React.ReactNode;
  withCancelButton?: boolean;
}) => {
  return (
    <DialogContent>
      <Stack className="gap-3">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription size="large">{description}</DialogDescription>
      </Stack>
      {children}
      <DialogButtonRow
        className="mt-3"
        withCancelButton={withCancelButton}
        asChild
      >
        {ConfirmationButton}
      </DialogButtonRow>
    </DialogContent>
  );
};

export {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogButtonRow,
  useDialogContext,
  DialogCloseButton,
  DialogDefault,
};
