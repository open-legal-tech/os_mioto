import { Stack } from "@mioto/design-system/Stack";
import { setRequestLocale } from "@mioto/locale/server";
import PrivacyContent from "../../../../content/privacy/privacy-latest.mdx";

export const metadata = {
  title: `Datenschutz | Mioto`,
};
export default async function LegalPage(
  props: {
    params: Promise<{
      locale: string;
    }>;
  }
) {
  const { locale } = await props.params;

  setRequestLocale(locale);
  return (
    <Stack className="pb-10">
      <PrivacyContent />
    </Stack>
  );
}
