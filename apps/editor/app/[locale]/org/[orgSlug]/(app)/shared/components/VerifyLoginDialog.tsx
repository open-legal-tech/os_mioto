import * as React from "react";

import {
  DialogDefault,
  DialogRoot,
  DialogTrigger,
} from "@mioto/design-system/Dialog";
import { Form } from "@mioto/design-system/Form";
import type { InfoBoxProps } from "@mioto/design-system/InfoBox";
import type { TColorScheme } from "@mioto/design-system/utils/sharedVariants";
import { useTranslations } from "@mioto/locale";
import { useActor } from "@xstate/react";
import { EmailField } from "../../../../../../shared/EmailInput";
import { PasswordInput } from "../../../../../../shared/PasswordInput";
import {
  createVerifyLoginMachine,
  type onVerify,
  type onVerifyFailure,
} from "./verifyLogin.machine";

export type VerfiyLoginDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  focusOnClose?: () => void;
  description?: React.ReactNode;
  onVerify: onVerify;
  onVerifyFailure?: onVerifyFailure;
  onClose?: () => void;
  colorScheme?: TColorScheme;
  additionalMessage?: InfoBoxProps;
  email: string;
  children?: React.ReactNode;
};

export function VerifyLoginDialog({
  children,
  open,
  setOpen,
  onVerifyFailure,
  onClose,
  description,
  email,
  onVerify,
}: VerfiyLoginDialogProps) {
  const t = useTranslations();

  const methods = Form.useForm({
    defaultValues: {
      email,
      password: "",
    },
  });

  const [machine] = React.useState(
    createVerifyLoginMachine(email, onVerify, (failure) => {
      onVerifyFailure?.(failure);
      if (failure) {
        methods.setError("root", {
          message: t(`auth.login.errors.${failure.code}`),
        });
      }
    }),
  );

  const [state, send] = useActor(machine);

  const definedDescription =
    description ?? t("components.verifyLogin.descriptionFallback");

  return (
    <Form.Provider methods={methods}>
      <DialogRoot
        open={open}
        onOpenChange={(open) => {
          setOpen?.(open);
          !open && onClose?.();
        }}
      >
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        <DialogDefault
          title={t("components.verifyLogin.title")}
          ConfirmationButton={
            <Form.SubmitButton isLoading={state.matches("verifingLogin")}>
              {t("components.verifyLogin.submit")}
            </Form.SubmitButton>
          }
          description={definedDescription}
        >
          <Form.Root
            onSubmit={methods.handleSubmit((values) =>
              send({ type: "VERIFY_LOGIN", password: values.password }),
            )}
          >
            <EmailField inputClassName="disabled:opacity-75" />
            <PasswordInput
              {...methods.register("password", {
                required: {
                  value: true,
                  message: t("components.verifyLogin.form.password.required"),
                },
              })}
            />
            {state.context.failure ? (
              <Form.FormError className="mt-2" name="root" />
            ) : null}
          </Form.Root>
        </DialogDefault>
      </DialogRoot>
    </Form.Provider>
  );
}
