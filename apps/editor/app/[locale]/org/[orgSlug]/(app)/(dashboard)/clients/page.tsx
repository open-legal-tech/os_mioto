import Heading from "@mioto/design-system/Heading";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import {
  getTranslations,
  setRequestLocale,
} from "@mioto/locale/server";
import { generateMiotoMetadata } from "../../../../../../shared/generateMiotoMetadata";
import { NewCustomerDialog } from "../shared/NewCustomerDialog";
import { FullClientList } from "./components/FullClientList";

export const generateMetadata = generateMiotoMetadata((t) => ({
  title: t("app.client.pageTitle"),
}));

export default async function ClientPage(
  props: {
    params: Promise<{ locale: string; orgSlug: string }>;
  }
) {
  const params = await props.params;

  const {
    locale,
    orgSlug
  } = params;

  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <Stack className="pt-9 gap-4 h-full px-4">
      <Row className="justify-between items-center">
        <Heading
          size="large"
          level={1}
          className="font-serif flex-row flex items-center gap-2"
        >
          {t("app.client.title")}
        </Heading>
        <NewCustomerDialog />
      </Row>
      <FullClientList orgSlug={orgSlug} />
    </Stack>
  );
}
