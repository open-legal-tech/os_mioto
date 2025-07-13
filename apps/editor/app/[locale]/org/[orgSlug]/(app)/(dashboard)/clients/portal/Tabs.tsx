"use client";

import { ButtonLink } from "@mioto/design-system/Button";
import Heading from "@mioto/design-system/Heading";
import { Row, rowClasses } from "@mioto/design-system/Row";
import { stackClasses } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import type React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { NewCustomerDialog } from "../../shared/NewCustomerDialog";

export function PortalTabs({
  ClientTab,
  SettingsTab,
}: {
  ClientTab: React.ReactNode;
  SettingsTab: React.ReactNode;
}) {
  const t = useTranslations();

  return (
    <Tabs
      className={stackClasses(
        {},
        "h-full pt-9 gap-4 col-[2] focus:outline-none px-4",
      )}
    >
      <Row className="justify-between items-center">
        <Heading
          size="large"
          level={1}
          className="font-serif flex-row flex items-center gap-2"
        >
          {t("app.portal.title")}
        </Heading>
        <Row className="items-center gap-2">
          <ButtonLink
            orgLink
            href={`/client`}
            target="_blank"
            variant="secondary"
            tooltip={{
              children: t("app.portal.demo.tooltip"),
              delay: 400,
            }}
          >
            <ArrowSquareOut />
            {t("app.portal.demo.link")}
          </ButtonLink>
          <NewCustomerDialog withPortalAccess />
        </Row>
      </Row>
      <Row className="justify-between items-center">
        <TabList
          aria-label="Portal Navigation"
          className={rowClasses({}, "gap-2")}
        >
          <Tab
            id="user"
            className="transition-colors p-2 focus-visible:outer-focus outline-none border-b border-transparent hover:border-gray5 selected:border-primary7 selected:font-weak text-mediumText cursor-pointer"
          >
            {t("app.portal.tabs.users")}
          </Tab>
          <Tab
            id="settings"
            className="transition-colors p-2 focus-visible:outer-focus outline-none border-b border-transparent hover:border-gray5 selected:border-primary7 selected:font-weak text-mediumText cursor-pointer"
          >
            {t("app.portal.tabs.settings")}
          </Tab>
        </TabList>
      </Row>
      <TabPanel id="user" className={stackClasses({}, "gap-2 h-full")}>
        {ClientTab}
      </TabPanel>
      <TabPanel id="settings" className="mt-6 overflow-hidden">
        {SettingsTab}
      </TabPanel>
    </Tabs>
  );
}
