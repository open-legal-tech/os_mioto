import { cardClasses } from "@mioto/design-system/Card";
import Heading from "@mioto/design-system/Heading";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import { getTranslations, setRequestLocale } from "@mioto/locale/server";
import { generateMiotoMetadata } from "../../../shared/generateMiotoMetadata";
import { CreateOrgForm } from "./CreateOrgForm";

export const generateMetadata = generateMiotoMetadata((t) => ({
  title: t("auth.create-org.pageTitle"),
}));

export default async function CreateOrgPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <Stack className="max-w-[500px] flex-1 justify-center gap-2">
      <Heading>{t("auth.create-org.title")}</Heading>
      <Stack className={cardClasses("gap-2 mb-8 -mx-4 bg-gray1")}>
        <Text>{t.rich("auth.create-org.description")}</Text>
      </Stack>
      <CreateOrgForm />
    </Stack>
  );
}
