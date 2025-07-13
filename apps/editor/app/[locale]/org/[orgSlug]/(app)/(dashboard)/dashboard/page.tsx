import Heading from "@mioto/design-system/Heading";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { getTranslations, setRequestLocale } from "@mioto/locale/server";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { generateMiotoMetadata } from "../../../../../../shared/generateMiotoMetadata";
import { NewProjectDropdown } from "./components/NewProjectDropdown";
import { TreeList } from "./components/TreeList";
import builderEnv from "../../../../../../../env";

export const generateMetadata = generateMiotoMetadata((t) => ({
  title: t("app.dashboard.pageTitle"),
}));

export default async function DashboardPage(
  props: {
    params: Promise<{
      locale: string;
      orgSlug: string;
    }>;
  }
) {
  const { locale } = await props.params;

  setRequestLocale(locale);
  const { user, db } = await getCurrentEmployee();

  const trees = (
    await db.tree.findMany({
      where: {
        organizationUuid: user.Organization.uuid,
        Employee: {
          some: {
            userUuid: user.uuid,
          },
        },
      },
      include: {
        Snapshots: {
          select: { uuid: true },
        },
      },
    })
  ).map((tree) => ({
    name: tree.name,
    description: tree.description,
    Snapshots: tree.Snapshots.map((snapshot) => snapshot.uuid),
    uuid: tree.uuid,
    isPublic: tree.isPublic,
    updatedAt: tree.updatedAt.toISOString(),
    createdAt: tree.createdAt.toISOString(),
  }));

  const t = await getTranslations();

  return (
    <Stack className="gap-4 h-full pt-9 px-4">
      <Row className="justify-between items-center flex-wrap gap-2">
        <Row className="gap-2 items-center">
          <Title />
          <HelpTooltip className="max-w-[350px] text-mediumHeading">
            {t("app.dashboard.help-tooltip.content")}
          </HelpTooltip>
        </Row>
        <NewProjectDropdown className="flex-1 md:flex-none" />
      </Row>
      <TreeList trees={trees} CLIENT_ENDPOINT={builderEnv.CLIENT_ENDPOINT} />
    </Stack>
  );
}

const Title = () => {
  const t = useTranslations();

  return (
    <Heading level={1} size="large" className="font-serif">
      {t("app.dashboard.title")}
    </Heading>
  );
};
