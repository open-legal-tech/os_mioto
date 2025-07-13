"use client";

import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import Logo from "@mioto/design-system/Logo";
import Separator from "@mioto/design-system/Separator";
import { useTranslations } from "@mioto/locale";
import { logoutAction } from "@mioto/server/actions/logout.action";
import { Gear, Info, SignOut } from "@phosphor-icons/react/dist/ssr";

export function UserMenu({
  label,
  className,
  ...props
}: {
  label?: string;
} & DropdownMenu.ButtonProps) {
  const t = useTranslations();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Button className={className} variant="tertiary" {...props}>
        {label ?? t("components.user-menu.label")}
      </DropdownMenu.Button>
      <DropdownMenu.Content align="end" sideOffset={12}>
        <DropdownMenu.Item Icon={<Gear />} orgLink href="/settings">
          {t("components.user-menu.settings")}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onAsyncSelect={async () => {
            await logoutAction();
          }}
          Icon={<SignOut />}
        >
          {t("components.user-menu.logout")}
        </DropdownMenu.Item>
        <Separator />
        <DropdownMenu.Item href="/docs" target="_blank" Icon={<Info />}>
          {t("components.user-menu.docs.label")}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
