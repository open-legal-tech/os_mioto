import { X } from "@phosphor-icons/react/dist/ssr";
import * as ToastPrimitives from "@radix-ui/react-toast";
import * as React from "react";
import { twMerge } from "../tailwind/merge";
import { type VariantProps, tv } from "../tailwind/tv";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = ({
  itemRef,
  className,
  ...props
}: ToastPrimitives.ToastViewportProps) => (
  <ToastPrimitives.Viewport
    itemRef={itemRef}
    className={twMerge(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
);

const toastVariants = tv({
  base: "data-[swipe=move]:transition-none group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded border p-6 pr-8 shadow-lg transition-all data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full",
  variants: {
    variant: {
      default: "bg-background border",
      destructive:
        "group destructive border-destructive bg-destructive text-destructive-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Toast = ({
  itemRef,
  className,
  variant,
  ...props
}: VariantProps<typeof toastVariants> & ToastPrimitives.ToastProps) => {
  return (
    <ToastPrimitives.Root
      itemRef={itemRef}
      className={toastVariants({ variant, className })}
      {...props}
    />
  );
};

const ToastAction = ({
  itemRef,
  className,
  ...props
}: ToastPrimitives.ToastActionProps) => (
  <ToastPrimitives.Action
    itemRef={itemRef}
    className={twMerge(
      "inline-flex h-8 shrink-0 items-center justify-center rounded border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-destructive/30 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className,
    )}
    {...props}
  />
);

const ToastClose = ({
  itemRef,
  className,
  ...props
}: ToastPrimitives.ToastCloseProps) => (
  <ToastPrimitives.Close
    itemRef={itemRef}
    className={twMerge(
      "absolute right-2 top-2 rounded p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
);

const ToastTitle = ({
  itemRef,
  className,
  ...props
}: ToastPrimitives.ToastTitleProps) => (
  <ToastPrimitives.Title
    itemRef={itemRef}
    className={twMerge("text-sm font-semibold", className)}
    {...props}
  />
);

const ToastDescription = ({
  itemRef,
  className,
  ...props
}: ToastPrimitives.ToastDescriptionProps) => (
  <ToastPrimitives.Description
    itemRef={itemRef}
    className={twMerge("text-sm opacity-90", className)}
    {...props}
  />
);

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
