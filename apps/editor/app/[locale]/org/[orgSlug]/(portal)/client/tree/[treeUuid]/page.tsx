import { cardClasses } from "@mioto/design-system/Card";
import Heading from "@mioto/design-system/Heading";
import { generateOrgMetadata } from "@mioto/design-system/Org";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import { useTranslations } from "@mioto/locale";
import {
  getTranslations,
  setRequestLocale,
} from "@mioto/locale/server";
import { getCurrentUser } from "@mioto/server/db/getCurrentUser";
import { notFound } from "next/navigation";
import { omit } from "remeda";
import { CreateRunButton } from "../../shared/CreateRunButton";
import { SessionCard } from "../../shared/SessionCard";

async function getTree(orgSlug: string, treeUuid: string) {
  const { db, user } = await getCurrentUser({ orgSlug });

  if (user.type === "employee") {
    const tree = await db.tree.findUnique({
      where: {
        uuid: treeUuid,
      },
      select: {
        uuid: true,
        name: true,
        description: true,
        Snapshots: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
        Sessions: {
          where: {
            ownerUuid: user.uuid,
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });

    if (!tree) return undefined;

    return { ...tree, credits: undefined };
  }

  const tree = await db.soldTree.findUnique({
    where: {
      treeUuid_customerUserUuid: {
        treeUuid: treeUuid,
        customerUserUuid: user.uuid,
      },
    },
    select: {
      credits: true,
      Tree: {
        select: {
          Snapshots: {
            take: 1,
            orderBy: {
              createdAt: "desc",
            },
          },
          uuid: true,
          name: true,
          description: true,
          Sessions: {
            where: {
              ownerUuid: user.uuid,
            },
            orderBy: {
              updatedAt: "desc",
            },
          },
        },
      },
    },
  });

  if (!tree) return undefined;
  return {
    ...omit(tree, ["Tree"]),
    ...tree.Tree,
  };
}

export const generateMetadata = async (props: {
  params: Promise<{
    treeUuid: string;
    locale: string;
    orgSlug: string;
  }>;
}) => {
  const { locale, orgSlug } = await props.params;
  const { db } = await getCurrentUser({ orgSlug: (await props.params).orgSlug });

  const tree = await db.tree.findFirst({
    where: { uuid: (await props.params).treeUuid },
    select: {
      name: true,
    },
  });

  return generateOrgMetadata((t) => ({
    title: t("client-portal.tree.pageTitle", { treeName: tree?.name }),
  }))({ params: { locale, orgSlug } });
};

export default async function TreeOverview(
  props: {
    params: Promise<{
      treeUuid: string;
      locale: string;
      orgSlug: string;
    }>;
  }
) {
  const params = await props.params;

  const {
    treeUuid,
    locale,
    orgSlug
  } = params;

  setRequestLocale(locale);
  const t = await getTranslations();

  const tree = await getTree(orgSlug, treeUuid);
  const snapshot = tree?.Snapshots[0];

  if (!tree || !snapshot) notFound();

  const remainingSessions = tree.credits
    ? tree.credits - tree.Sessions.length
    : undefined;

  return (
    <Stack className="py-6 lg:py-9 h-full overflow-auto pr-4 -mr-4">
      <div className="mb-4 lg:mb-7 flex gap-4 justify-center">
        <Heading className="font-serif" size="large">
          {tree.name}
        </Heading>
      </div>
      <Stack className="lg:overflow-hidden gap-2 lg:h-full">
        {tree.description ? (
          <Text className={cardClasses("text-largeText")}>
            {tree.description}
          </Text>
        ) : null}

        {remainingSessions ? (
          <RemainingSessionsCard
            className="lg:hidden"
            remainingSessions={remainingSessions}
          />
        ) : null}

        <div
          className={twMerge(
            "flex flex-col gap-2 lg:overflow-hidden",
            remainingSessions && "lg:grid lg:grid-cols-[7fr_3fr]",
          )}
        >
          <Stack
            className={cardClasses("gap-4 justify-center lg:overflow-auto p-0")}
          >
            <Row
              className={twMerge(
                "justify-between flex-wrap gap-2 p-4 items-center",
                tree.Sessions.length > 0 && "pb-0",
              )}
            >
              <Heading size="small">
                {t("client-portal.tree.session-list.title")}
              </Heading>
              <CreateRunButton
                snapshotUuid={snapshot.uuid}
                treeUuid={tree.uuid}
                numberOfExistingSessions={tree.Sessions.length}
                allowedNumberOfSessions={tree.credits ?? undefined}
                className="grow-0"
                treeName={tree.name}
              />
            </Row>
            {tree.Sessions.length > 0 ? (
              <Stack>
                {tree.Sessions.map((session) => (
                  <SessionCard
                    key={session.uuid}
                    sessionName={session.userLabel ?? session.name}
                    sessionUpdateDate={session.updatedAt.toISOString()}
                    sessionUuid={session.uuid}
                    inProgress={session.status !== "COMPLETED"}
                    className="rounded-none border-x-0 border-t-0 first:border-t last:border-b-0"
                  />
                ))}
              </Stack>
            ) : null}
          </Stack>
          {remainingSessions ? (
            <RemainingSessionsCard
              className="hidden lg:flex self-start"
              remainingSessions={remainingSessions}
            />
          ) : null}
        </div>
      </Stack>
    </Stack>
  );
}

const RemainingSessionsCard = ({
  remainingSessions,
  className,
}: {
  remainingSessions: number;
  className?: string;
}) => {
  const t = useTranslations();

  return (
    <Stack
      className={cardClasses(["items-center justify-center gap-2", className])}
    >
      {Number.isFinite(remainingSessions) ? (
        <>
          <Text emphasize="strong" className="text-center">
            {t("client-portal.tree.remaining-sessions.title")}
          </Text>
          <span className="text-mediumHeading">
            {remainingSessions >= 0 ? remainingSessions : 0}
          </span>
        </>
      ) : (
        <Text emphasize="strong" className="text-center">
          {t("client-portal.tree.unlimited-sessions.title")}
        </Text>
      )}
    </Stack>
  );
};
