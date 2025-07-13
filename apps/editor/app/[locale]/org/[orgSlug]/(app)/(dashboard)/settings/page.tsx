import { Heading } from "@mioto/design-system/Heading";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import {
  getTranslations,
  setRequestLocale,
} from "@mioto/locale/server";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { ChangeEmail } from "../../../../../../shared/ChangeEmail";
import { ChangePassword } from "../../../../../../shared/ChangePassword";
import { generateMiotoMetadata } from "../../../../../../shared/generateMiotoMetadata";
import { DeleteAccount } from "../../shared/components/DeleteAccount";
import { ThemeMenu } from "../shared/ThemeEditor/ThemeMenu";
import { ThemeSelector } from "../shared/ThemeEditor/ThemeSelector";
import { OrgSettingsForm } from "./OrgSettingsForm";

export const generateMetadata = generateMiotoMetadata((t) => ({
  title: t("app.settings.title"),
}));

export default async function SettingsPage(
  props: {
    params: Promise<{
      locale: string;
    }>;
  }
) {
  const { locale } = await props.params;

  setRequestLocale(locale);
  const { user, db } = await getCurrentEmployee();
  const themes = (
    await db.theme.findMany({
      where: {
        organizationUuid: user.organizationUuid,
      },
      orderBy: {
        name: "asc",
      },
    })
  ).map((theme) => ({ name: theme.name, id: theme.uuid }));

  const t = await getTranslations({ locale });

  return (
    <Stack className="col-[3/4] row-[2/4] overflow-y-auto pb-4 px-4 -mr-4 gap-4 mt-9">
      <Title />
      <Stack className="gap-8 mt-6">
        <Stack className="gap-3">
          <Heading id="org-settings" size="small">
            {t("app.settings.org-config.title")}
          </Heading>
          <Row className="gap-1">
            <ThemeSelector
              selectedTheme={user.Organization.Theme?.uuid}
              options={themes.map((theme) => ({
                name: theme.name,
                id: theme.id,
                type: "option",
                data: undefined,
              }))}
              id="theme-selector"
            />
            <ThemeMenu
              options={themes.map((theme) => ({
                name: theme.name,
                id: theme.id,
              }))}
            />
          </Row>
          <OrgSettingsForm orgName={user.Organization.name} />
        </Stack>
        <Stack className="gap-3">
          <Heading id="user-settings" size="small">
            {t("app.settings.user.title")}
          </Heading>
          <ChangePassword userEmail={user.Account.email} />
          <ChangeEmail userEmail={user.Account.email} />
          <DeleteAccount userEmail={user.Account.email} />
        </Stack>
      </Stack>
    </Stack>
  );
}

const Title = () => {
  const t = useTranslations();

  return (
    <Heading size="large" level={1} className="font-serif">
      {t("app.settings.title")}
    </Heading>
  );
};
