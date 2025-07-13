import { Stack } from "@mioto/design-system/Stack";
import { setRequestLocale } from "@mioto/locale/server";
import ImprintContent from "../../../../content/imprint/imprint-latest.mdx";

export const metadata = {
  title: `Impressum | Mioto`,
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
      <ImprintContent />
    </Stack>
  );
}
