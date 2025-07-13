import type * as React from "react";
import {
  type VerfiyLoginDialogProps,
  VerifyLoginDialog,
} from "./VerifyLoginDialog";

type Props = {
  children: React.ReactNode;
  email: string;
} & VerfiyLoginDialogProps;

export function VerifiedSettingsChange({ children, email, ...props }: Props) {
  return (
    <>
      {props.open ? <VerifyLoginDialog email={email} {...props} /> : null}
      {children}
    </>
  );
}
