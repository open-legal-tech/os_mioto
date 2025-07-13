import { cardClasses } from "@mioto/design-system/Card";
import Heading from "@mioto/design-system/Heading";
import Link from "@mioto/design-system/Link";
import { generateOrgMetadata } from "@mioto/design-system/Org";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import {
  getLocale,
  getTranslations,
  setRequestLocale,
} from "@mioto/locale/server";
import { CreateRunButton } from "./shared/CreateRunButton";
import { SessionCard } from "./shared/SessionCard";
import { getCustomerTrees } from "./shared/getCustomerTrees";
import { redirect } from "../../../../../../i18n/routing";

export const generateMetadata = generateOrgMetadata((t) => ({
  title: t("client-portal.dashboard.pageTitle"),
}));

export default async function ClientPage(props: {
  params: Promise<{
    locale: string;
    orgSlug: string;
  }>;
}) {
  const params = await props.params;

  const { locale, orgSlug } = params;

  setRequestLocale(locale);
  const t = await getTranslations();

  // This gets all customer trees that have a session
  const customerTreesWithSessions = await getCustomerTrees({ orgSlug });
  const firstCustomerTree = customerTreesWithSessions[0];

  if (customerTreesWithSessions.length === 1 && firstCustomerTree) {
    redirect({
      href: `/org/${orgSlug}/client/tree/${firstCustomerTree.uuid}`,
      locale: await getLocale(),
    });
  }

  return customerTreesWithSessions.length > 0 ? (
    <Stack className="h-full pb-8 overflow-y-auto pr-4 -mr-4">
      <Heading
        className="font-serif mt-5 mb-3 lg:mt-9 lg:mb-7 self-center"
        size="large"
      >
        {t("client-portal.dashboard.title")}
      </Heading>
      <Stack className="gap-4">
        {customerTreesWithSessions.map((tree) => {
          const lastSession = tree.Sessions.filter(
            (session) => session.status === "IN_PROGRESS",
          )[0];

          const snapshot = tree.Snapshots[0];
          if (!snapshot) return null;

          return (
            <Stack key={tree.uuid}>
              <div
                className={cardClasses(
                  `flex flex-col md:items-start ${
                    lastSession ? "border-b-0 rounded-b-none" : ""
                  }`,
                )}
              >
                <Stack className="gap-4 justify-center w-full">
                  <div className="flex justify-between flex-wrap flex-1 items-center gap-4">
                    <Link
                      orgLink
                      href={`/client/tree/${tree.uuid}` as const}
                      className="flex-1"
                    >
                      <Heading className="font-serif" size="small">
                        {tree.name}
                      </Heading>
                    </Link>
                    <CreateRunButton
                      snapshotUuid={snapshot.uuid}
                      numberOfExistingSessions={tree.Sessions.length}
                      allowedNumberOfSessions={tree.credits ?? undefined}
                      treeUuid={tree.uuid}
                      treeName={tree.name}
                      className="flex-0"
                    />
                  </div>
                  {tree.description ? (
                    <Link
                      orgLink
                      href={`/client/tree/${tree.treeUuid}` as const}
                      className="h-full"
                    >
                      <Text size="large">
                        {tree.description.length > 300
                          ? `${tree.description
                              .split("")
                              .slice(0, 300)
                              .join("")}...`
                          : tree.description}
                      </Text>
                    </Link>
                  ) : null}
                </Stack>
              </div>
              {lastSession ? (
                <SessionCard
                  sessionName={lastSession.userLabel ?? lastSession.name}
                  sessionUuid={lastSession.uuid}
                  sessionUpdateDate={lastSession.updatedAt.toISOString()}
                />
              ) : null}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  ) : (
    <Stack center className="h-full">
      <Stack center className={cardClasses("gap-2")}>
        <Heading className="font-serif">
          {t("client-portal.dashboard.empty.title")}
        </Heading>
        <Text size="large">{t("client-portal.dashboard.empty.content")}</Text>
      </Stack>
    </Stack>
  );
}
