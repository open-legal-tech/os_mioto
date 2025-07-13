import { ErrorMessage } from "@hookform/error-message";
import { FatalError } from "@mioto/errors";
import * as React from "react";
import {
  type DeepPartial,
  type FieldValues,
  FormProvider,
  useForm as useReactHookForm,
  useFormContext as useReactHookFormContext,
} from "react-hook-form";
import { type MessageProps, messageClasses } from "../Message/Message";
import {
  type SubmitButtonProps,
  SubmitButton as SystemSubmitButton,
} from "../SubmitButton";
import { twMerge } from "../tailwind/merge";

export type { FieldValues } from "react-hook-form";

// ------------------------------------------------------------------
// Provider

const FormIdContext = React.createContext<string | undefined>(undefined);

export type ProviderProps<TFieldValues extends FieldValues> = {
  methods: UseFormReturn<TFieldValues>;
  children: React.ReactNode;
  id?: string;
};

export const Provider = <TFieldValues extends FieldValues>({
  methods,
  children,
  id,
}: ProviderProps<TFieldValues>) => {
  id = id ?? React.useId();

  return (
    <FormIdContext.Provider value={id}>
      <FormProvider {...methods}>{children}</FormProvider>
    </FormIdContext.Provider>
  );
};

// ------------------------------------------------------------------
// Context Hook

export const useFormContext = <TFieldValues extends FieldValues>() => {
  const id = React.useContext(FormIdContext);

  if (!id) {
    throw new FatalError({
      code: "missing_form_provider",
      debugMessage: "You must wrap your form with the Form.Provider component.",
    });
  }

  return {
    id,
    ...(useReactHookFormContext<TFieldValues>() as UseFormReturn<TFieldValues>),
  };
};

// ------------------------------------------------------------------
// Root

const rootClasses = "gap-3 flex flex-col";

export type RootProps<TFieldValues extends FieldValues> = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  "onChange"
> & {
  onChange?: (data: DeepPartial<TFieldValues>) => void;
};

export function Root<TFieldValues extends FieldValues>({
  children,
  className,
  onChange,
  ...props
}: RootProps<TFieldValues>) {
  const formContext = useFormContext<TFieldValues>();

  if (onChange) {
    formContext.watch((data) => {
      onChange?.(data);
      formContext.clearErrors();
    });
  }

  return (
    <Provider id={formContext.id} methods={formContext}>
      <form
        className={className ? twMerge(rootClasses, className) : rootClasses}
        id={formContext.id}
        {...props}
      >
        {children}
      </form>
    </Provider>
  );
}

// ------------------------------------------------------------------
// Checkbox
export * from "../Checkbox";

// ------------------------------------------------------------------
// Inputs

export * from "../Input";
export * from "../Textarea";
export * from "../FileInput";
export * from "../FileReaderInput";

// ------------------------------------------------------------------
// Label

export { Label } from "../Label/Label";

// ------------------------------------------------------------------
// Error

export type ErrorProps = Omit<MessageProps, "code"> & { name: string };

export const FormError = ({ className, size, name, ...props }: ErrorProps) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => {
        const [type, error] = message?.includes("__")
          ? message.split("__")
          : ["danger", message];

        if (type !== "warning" && type !== "danger")
          throw new FatalError({
            code: "invalid_error_type",
            debugMessage: `The error type "${type}" is not supported. Please use "warning" or "danger".`,
          });

        return (
          <span
            className={messageClasses({ size, colorScheme: type }, [className])}
            role="alert"
            aria-label={message}
            {...props}
          >
            {error}
          </span>
        );
      }}
    />
  );
};

// ------------------------------------------------------------------
// RadioButton

export * from "../RadioButton";

// ------------------------------------------------------------------
// Submit

export const SubmitButton = (props: SubmitButtonProps) => {
  const { formState, id } = useFormContext();

  return (
    <SystemSubmitButton
      form={id}
      isLoading={formState.isSubmitting}
      {...props}
    />
  );
};

// ------------------------------------------------------------------

export const useForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues = any,
>(
  props?: Parameters<
    typeof useReactHookForm<TFieldValues, TContext, TTransformedValues>
  >[0],
) => {
  const methods = useReactHookForm(props);
  const [, startTransition] = React.useTransition();

  const handleAsyncSubmit = (
    submitHandler: Parameters<(typeof methods)["handleSubmit"]>[0],
  ) =>
    methods.handleSubmit((data) => {
      return Promise.race([
        new Promise((resolve) => {
          startTransition(async () => {
            const result = await submitHandler(data);
            resolve(result);
          });
        }),
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(`timeout ${submitHandler?.name}`);
          }, 10000);
        }),
      ]);
    });

  return { ...methods, handleAsyncSubmit };
};

export type UseFormReturn<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues = any,
> = ReturnType<typeof useForm<TFieldValues, TContext, TTransformedValues>>;

export * from "../Field/Field";

export { useFieldArray, Controller } from "react-hook-form";
export type { ControllerRenderProps } from "react-hook-form";

export * from "../Message/Message";
