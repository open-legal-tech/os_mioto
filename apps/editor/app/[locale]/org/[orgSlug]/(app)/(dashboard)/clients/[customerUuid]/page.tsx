import { cardClasses } from "@mioto/design-system/Card";
import Heading from "@mioto/design-system/Heading";
import { IconButtonLink } from "@mioto/design-system/IconButton";
import Link from "@mioto/design-system/Link";
import { Row, rowClasses } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "@mioto/locale/server";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import {
  ArrowSquareOut,
  Buildings,
  Envelope,
  IdentificationCard,
} from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { generateMiotoMetadata } from "../../../../../../../shared/generateMiotoMetadata";
import { ClientStatusBadge } from "../components/ClientStatusBadge";
import { ShareTreeDialogServer } from "../components/ShareTreeDialog/ShareTreeDialog.server";
import { ShareDialogTrigger } from "./ShareDialogTrigger";

export const generateMetadata = async (
  props: {
    params: Promise<{
      customerUuid: string;
      orgSlug: string;
      locale: string;
    }>;
  }
) => {
  const params = await props.params;

  const { customerUuid } = params;

  const { db } = await getCurrentEmployee();

  const customer = await db.customer.findUnique({
    where: {
      userUuid: customerUuid,
    },
  });

  return await generateMiotoMetadata((t) => ({
    title: customer?.fullName ?? t("app.client.individual.pageTitle"),
  }))({ params });
};

export default async function CustomerPage(
  props: {
    params: Promise<{
      customerUuid: string;
      locale: string;
    }>;
  }
) {
  const params = await props.params;

  const {
    customerUuid,
    locale
  } = params;

  setRequestLocale(locale);

  const format = await getFormatter();
  const t = await getTranslations();
  const { db } = await getCurrentEmployee();

  const customer = await db.customer.findUnique({
    where: { userUuid: customerUuid },
    select: {
      fullName: true,
      referenceNumber: true,
      company: true,
      userUuid: true,
      SoldTrees: {
        select: {
          Tree: {
            select: {
              name: true,
            },
          },
          treeUuid: true,
          credits: true,
        },
      },
      User: {
        select: {
          isBlocked: true,
          Account: { select: { email: true } },
          status: true,
          Sessions: {
            orderBy: {
              updatedAt: "desc",
            },
            select: {
              userLabel: true,
              updatedAt: true,
              uuid: true,
              name: true,
              Tree: { select: { name: true, uuid: true } },
              status: true,
            },
          },
        },
      },
    },
  });

  if (!customer) notFound();

  return (
    <Stack className="mt-9 mb-7 gap-4 overflow-y-auto">
      <Heading
        className="font-serif self-center mb-2 flex items-center gap-2"
        size="large"
        level={1}
      >
        {customer.fullName ?? customer.User.Account?.email}
        <ClientStatusBadge
          status={customer.User.isBlocked ? "BLOCKED" : customer.User.status}
          className="inline-flex py-1 px-4 font-weak"
        />
      </Heading>
      <Row className="gap-4">
        <Stack className={cardClasses("min-w-[300px] gap-2")}>
          {customer.User.Account ? (
            <Link
              size="large"
              className="justify-self-end gap-2"
              href={`mailto:${customer.User.Account.email}` as const}
            >
              <Envelope />
              {customer.User.Account.email}
            </Link>
          ) : null}
          <Text size="large" className={rowClasses({}, "gap-2 items-center")}>
            <IdentificationCard />
            {customer.referenceNumber ?? (
              <span className="text-gray7">Keine Referenznummer</span>
            )}
          </Text>
          <Text size="large" className={rowClasses({}, "gap-2 items-center")}>
            <Buildings />
            {customer.company ?? (
              <span className="text-gray7">Keine Unternehmen</span>
            )}
          </Text>
        </Stack>
        <Stack className={cardClasses("flex-1 gap-1")}>
          <Heading level={2} size="small">
            {t("app.client.page.tasks.title")}
          </Heading>
          <Text className="text-gray8">
            {t("app.client.page.tasks.description")}
          </Text>
        </Stack>
      </Row>
      <Stack className={cardClasses("flex-1 gap-4")}>
        <Row className="items-center justify-between">
          <Heading size="small" level={2}>
            {t("app.client.page.shared-apps.title")}
          </Heading>
          <ShareDialogTrigger>
            <ShareTreeDialogServer clientUuid={customerUuid} />
          </ShareDialogTrigger>
        </Row>
        <Stack className="w-full gap-2">
          {customer.SoldTrees?.map((soldTree) => {
            const treeSessions = customer.User.Sessions?.filter(
              (session) => session.Tree.uuid === soldTree.treeUuid,
            );

            return (
              <Stack
                key={soldTree.treeUuid}
                className={cardClasses("bg-gray1")}
              >
                <Row className="items-baseline gap-1">
                  <Heading level={3} size="extra-small">
                    {soldTree.Tree.name}
                  </Heading>
                  <IconButtonLink
                    tooltip={{
                      children: t("app.client.page.app-card.open-in-editor"),
                    }}
                    href={`/builder/${soldTree.treeUuid}` as const}
                  >
                    <ArrowSquareOut weight="bold" />
                  </IconButtonLink>
                </Row>
                <Text>
                  {soldTree.credits
                    ? t(
                        "app.client.page.app-card.session-count.number-of-sessions",
                        {
                          remainingSessions:
                            soldTree.credits - treeSessions.length,
                        },
                      )
                    : t("app.client.page.app-card.session-count.unlimited")}
                </Text>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
      <Stack className={cardClasses("gap-4")}>
        <Heading level={3} size="small">
          {t("app.client.page.app-card.active-session.title")}
        </Heading>
        {customer.User.Sessions?.filter(
          (session) => session.status === "IN_PROGRESS",
        ).map((session) => (
          <Row
            className={cardClasses("bg-gray1 items-start justify-between")}
            key={session.uuid}
          >
            <Stack className="gap-2">
              <Heading size="extra-small" level={4}>
                {session.name}
                {session.userLabel ? (
                  <Text className="text-gray9" size="small">
                    (Mandantenlabel: {session.userLabel})
                  </Text>
                ) : null}
              </Heading>
              <Stack>
                <Text className="font-weak">
                  {t("app.client.page.session-card.app-title")}
                </Text>
                <Text>{session.Tree.name}</Text>
              </Stack>
              <Stack>
                <Text className="font-weak">
                  {t("app.client.page.session-card.last-edit")}
                </Text>
                <Text>
                  {format.dateTime(session.updatedAt, {
                    timeStyle: "short",
                    dateStyle: "medium",
                  })}
                </Text>
              </Stack>
            </Stack>
          </Row>
        ))}
      </Stack>
      <Stack className={cardClasses("gap-4")}>
        <Heading level={3} size="small">
          Abgeschlossene Sessions
        </Heading>
        {customer.User.Sessions?.filter(
          (session) => session.status === "COMPLETED",
        ).map((session) => (
          <Row
            className={cardClasses("bg-gray1 items-start justify-between")}
            key={session.uuid}
          >
            <Stack className="gap-2">
              <Heading size="extra-small" level={4}>
                {session.name}
                {session.userLabel ? (
                  <Text className="text-gray9" size="small">
                    (Mandantenlabel: {session.userLabel})
                  </Text>
                ) : null}
              </Heading>
              <Stack>
                <Text className="font-weak">Anwendung</Text>
                <Text>{session.Tree.name}</Text>
              </Stack>
              <Stack>
                <Text className="font-weak">Zuletzt bearbeitet</Text>
                <Text>
                  {format.dateTime(session.updatedAt, {
                    timeStyle: "short",
                    dateStyle: "medium",
                  })}
                </Text>
              </Stack>
            </Stack>
          </Row>
        ))}
      </Stack>
    </Stack>
  );
}
