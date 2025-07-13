import { Heading } from "@mioto/design-system/Heading";
import { generateOrgMetadata } from "@mioto/design-system/Org";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { setRequestLocale } from "@mioto/locale/server";
import { getCurrentUser } from "@mioto/server/db/getCurrentUser";
import { notFound } from "next/navigation";
import { ChangeEmail } from "../../../../../../shared/ChangeEmail";
import { ChangePassword } from "../../../../../../shared/ChangePassword";

export const generateMetadata = generateOrgMetadata((t) => ({
  title: t("client-portal.settings.pageTitle"),
}));

export default async function SettingsPage(
  props: {
    params: Promise<{
      locale: string;
      orgSlug: string;
    }>;
  }
) {
  const params = await props.params;

  const {
    locale,
    orgSlug
  } = params;

  setRequestLocale(locale);

  const { user } = await getCurrentUser({ orgSlug });

  if (!user.Account) notFound();

  return (
    <>
      <Title />
      <Stack className="gap-3 overflow-y-auto pb-4">
        <ChangeEmail userEmail={user.Account.email} />
        <ChangePassword userEmail={user.Account.email} />
      </Stack>
    </>
  );
}

const Title = () => {
  const t = useTranslations();

  return (
    <Heading
      size="large"
      level={1}
      className="font-serif mt-5 mb-3 lg:mt-9 lg:mb-7 self-center"
    >
      {t("app.settings.title")}
    </Heading>
  );
};
