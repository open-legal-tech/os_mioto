import { serverAnalytics } from "@mioto/analytics/server";
import { ButtonLink } from "@mioto/design-system/Button";
import Link from "@mioto/design-system/Link";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { Tooltip } from "@mioto/design-system/Tooltip";
import { Failure } from "@mioto/errors";
import {
  getTranslations,
  setRequestLocale,
} from "@mioto/locale/server";
import { getCurrentUser } from "@mioto/server/db/getCurrentUser";
import { File, Gear } from "@phosphor-icons/react/dist/ssr";
import { Folder } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type * as React from "react";
import { NotFound } from "../../../../../shared/error/NotFound/NotFound";
import { getPortalAssets } from "../shared/getPortalAssets";
import { LogoutButton } from "./LogoutButton";
import { createAcronym } from "./shared/createAcronym";
import { getCustomerTrees } from "./shared/getCustomerTrees";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    orgSlug: string;
  }>;
};

export default async function ClientDashboard(props: Props) {
  const params = await props.params;

  const {
    locale,
    orgSlug
  } = params;

  const {
    children
  } = props;

  setRequestLocale(locale);
  const t = await getTranslations();
  const { user, db } = await getCurrentUser({ orgSlug });

  const org = await db.organization.findUnique({
    where: { uuid: user.organizationUuid },
    select: {
      homepageUrl: true,
      name: true,
      slug: true,
      ClientPortal: {
        select: {
          logoUuid: true,
          backgroundUuid: true,
        },
      },
      Theme: {
        select: {
          content: true,
        },
      },
    },
  });

  if (user.type === "customer" && !user.Customer?.hasPortalAccess) {
    return (
      <NotFound
        heading={t("client-portal.no-access.title")}
        content={
          <Text size="large">
            {t.rich("client-portal.no-access.content", {
              orgName: user.Organization.name,
            })}
          </Text>
        }
        withSupport={false}
        withBackbutton={false}
      />
    );
  }

  const assets = await getPortalAssets({ orgSlug });

  serverAnalytics()?.capture({
    event: "$feature_view",
    distinctId: user.uuid,
    sendFeatureFlags: true,
  });

  const customerTrees = await getCustomerTrees({ orgSlug });

  const Logo = assets?.logoUrl ? (
    <Image
      src={assets.logoUrl}
      alt="Logo"
      fill
      style={{ objectFit: "contain" }}
      quality={75}
      priority
      sizes="20vw"
    />
  ) : (
    <span className="text-black text-extraLargeHeading">
      {org?.name ? createAcronym(org.name) : "Logo"}
    </span>
  );

  return (
    <>
      <Stack
        className={`org-theme font-sans overflow-hidden lg:grid lg:grid-rows-[220px,1fr] lg:grid-cols-[220px,1fr] h-full items-center lg:items-stretch pt-2 lg:pt-0`}
      >
        <div className="col-[1] p-7 bg-gray2 hidden lg:flex relative border-r border-gray5">
          {assets?.backgroundUrl ? (
            <Image src={assets.backgroundUrl} alt="" fill />
          ) : null}
          <Stack className="relative w-full h-full" center>
            {user.Organization.homepageUrl ? (
              <Link ghost href={user.Organization.homepageUrl} target="_blank">
                {Logo}
              </Link>
            ) : (
              Logo
            )}
          </Stack>
        </div>
        <div className="grid flex-1 [--padding:0px] lg:[--padding:100px] grid-cols-[var(--padding)_minmax(300px,_900px)_var(--padding)] justify-center lg:col-[2] lg:row-span-full px-4 h-full overflow-y-auto py-4 md:pt-8">
          <div className="h-full col-[2]">{children}</div>
        </div>
        <Stack className="bg-white border-r border-t border-gray5 p-3 col-[1] row-[2] justify-between hidden lg:flex">
          <Stack center className="mt-2 gap-2 lg:flex-col items-stretch">
            {customerTrees.length > 1 ? (
              <ButtonLink
                orgLink
                href={`/client`}
                variant="tertiary"
                className="justify-start text-gray10"
              >
                <Folder className="min-w-max" weight="bold" />
                {t("client-portal.dashboard.menu.dashboardLink.tooltip")}
              </ButtonLink>
            ) : null}
            {Object.values(customerTrees).map((tree) => (
              <Tooltip.Root key={tree.uuid}>
                <Tooltip.Trigger asChild>
                  <ButtonLink
                    orgLink
                    href={`/client/tree/${tree.uuid}` as const}
                    variant="tertiary"
                    className="justify-start text-gray10"
                  >
                    <File className="min-w-max" weight="bold" />
                    <span className="max-h-[20px] flex-1 overflow-hidden flex items-start">
                      {tree.name}
                    </span>
                  </ButtonLink>
                </Tooltip.Trigger>
                <Tooltip.Content side="right">{tree.name}</Tooltip.Content>
              </Tooltip.Root>
            ))}
          </Stack>
          <Stack className="gap-2">
            <ButtonLink
              orgLink
              href={`/client/settings`}
              variant="tertiary"
              className="justify-start text-gray10"
            >
              <Gear className="min-w-max" weight="bold" />
              {t("client-portal.dashboard.menu.settingsLink.tooltip")}
            </ButtonLink>
            <LogoutButton className="justify-start" />
          </Stack>
        </Stack>
        <div className="grid grid-cols-3 lg:hidden p-2 w-full border-t">
          <div />
          <Row center className="gap-2">
            {customerTrees.length > 1 ? (
              <ButtonLink
                orgLink
                href={`/client`}
                variant="tertiary"
                className="text-gray10"
              >
                <Folder className="min-w-max" weight="bold" />
              </ButtonLink>
            ) : (
              Object.values(customerTrees).map((tree) => (
                <Tooltip.Root key={tree.uuid}>
                  <Tooltip.Trigger asChild>
                    <ButtonLink
                      orgLink
                      href={`/client/tree/${tree.uuid}` as const}
                      variant="tertiary"
                      className="justify-start text-gray10"
                    >
                      <File className="min-w-max" weight="bold" />
                    </ButtonLink>
                  </Tooltip.Trigger>
                  <Tooltip.Content side="right">{tree.name}</Tooltip.Content>
                </Tooltip.Root>
              ))
            )}
            <ButtonLink
              orgLink
              href={`/client/settings`}
              variant="tertiary"
              className="text-gray10"
            >
              <Gear className="min-w-max" weight="bold" />
            </ButtonLink>
          </Row>
          <LogoutButton className="justify-self-end" size="medium" iconOnly />
        </div>
      </Stack>
    </>
  );
}
