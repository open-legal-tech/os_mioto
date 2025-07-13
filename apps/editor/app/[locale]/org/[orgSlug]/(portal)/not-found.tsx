import Heading from "@mioto/design-system/Heading";
import { generateOrgMetadata } from "@mioto/design-system/Org";
import { Stack } from "@mioto/design-system/Stack";
import { getTranslations } from "@mioto/locale/server";

export async function generateMetadata() {
  return generateOrgMetadata((t) => ({
    title: t("client-portal.not-found.pageTitle"),
  }));
}

export default async function ClientNotFound() {
  const t = await getTranslations();

  return (
    <Stack center className="h-[100dvh]">
      <Stack className="border border-gray5 p-5 rounded-md bg-white gap-4">
        <Heading>{t("client-portal.not-found.title")}</Heading>
      </Stack>
    </Stack>
  );
}
