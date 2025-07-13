import { Header } from "@mioto/design-system/Header";
import { IconButtonLink } from "@mioto/design-system/IconButton";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import {
  getTranslations,
  setRequestLocale,
} from "@mioto/locale/server";
import {
  File,
  Fingerprint,
  Gear,
  Person,
} from "@phosphor-icons/react/dist/ssr";
import type * as React from "react";
import { DashboardLayout } from "../../../../../shared/DashboardLayout";
import { InfoDropdown } from "../../../../../shared/InfoDropdown";
import { LanguageToggle } from "../shared/components/LanguageToggle";
import { UserMenu } from "../shared/components/UserMenu";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string; orgSlug: string }>;
};

export default async function Layout(props: Props) {
  const { locale } = await props.params;

  const {
    children
  } = props;

  setRequestLocale(locale);

  const t = await getTranslations({ locale });

  return (
    <DashboardLayout>
      <Header
        className="col-span-full row-[1]"
        RightSlot={
          <Row className="items-center">
            <LanguageToggle />
            <UserMenu />
          </Row>
        }
      />
      <Stack className="bg-white col-span-1 row-[2] border-r border-gray5 justify-between py-2">
        <Stack center className="mt-2 gap-2">
          <IconButtonLink
            orgLink
            href="/dashboard"
            tooltip={{
              delay: 0,
              side: "right",
              children: t("app.dashboard.menu.my-apps.tooltip"),
            }}
          >
            <File />
          </IconButtonLink>
          <IconButtonLink
            orgLink
            href="/clients"
            tooltip={{
              delay: 0,
              side: "right",
              children: t("app.dashboard.menu.clients.tooltip"),
            }}
          >
            <Person />
          </IconButtonLink>
          <IconButtonLink
            orgLink
            href={`/clients/portal`}
            tooltip={{
              delay: 0,
              side: "right",
              children: t("app.dashboard.menu.portal.tooltip"),
            }}
          >
            <Fingerprint />
          </IconButtonLink>
          <IconButtonLink
            orgLink
            href={`/settings`}
            tooltip={{
              delay: 0,
              side: "right",
              children: t("app.dashboard.menu.settings.tooltip"),
            }}
          >
            <Gear />
          </IconButtonLink>
        </Stack>
        <Stack center>
          <InfoDropdown />
        </Stack>
      </Stack>
      <Row className="col-[3] row-[2] justify-center overflow-hidden h-full">
        <Stack className="max-w-[800px] flex-1 h-full">{children}</Stack>
      </Row>
    </DashboardLayout>
  );
}
