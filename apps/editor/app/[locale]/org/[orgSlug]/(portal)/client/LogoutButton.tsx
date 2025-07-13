"use client";

import {
  type ButtonVariants,
  buttonClasses,
} from "@mioto/design-system/Button";
import { useTranslations } from "@mioto/locale";
import { logoutAction } from "@mioto/server/actions/logout.action";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import React from "react";

type Props = {
  className?: string;
  iconOnly?: boolean;
} & ButtonVariants;

export function LogoutButton({ className, size, iconOnly }: Props) {
  const [_, startTransition] = React.useTransition();
  const t = useTranslations();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(() => {
          logoutAction();
        });
      }}
      className={buttonClasses({
        size,
        variant: "tertiary",
        className: `text-gray10 ${className}`,
      })}
    >
      <SignOut weight="bold" />
      {!iconOnly ? t("client-portal.dashboard.logoutButton") : null}
    </button>
  );
}
