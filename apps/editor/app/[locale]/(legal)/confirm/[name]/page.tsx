import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import { setRequestLocale } from "@mioto/locale/server";
import { latestLegalPagesContent } from "../../../../../content/latestLegalPagesContent";
import {
  type LegalPages,
  latestLegalVersions,
} from "../../../../../content/legal";
import { LegalConfirmationButton } from "../../shared/LegalConfirmationButton";

type Props = {
  params: Promise<{ name: Exclude<LegalPages, "imprint">; locale: string }>;
};

export default async function ConfirmationPage(props: Props) {
  const { locale, name } = await props.params;
  setRequestLocale(locale);
  const Content = latestLegalPagesContent[name];

  return (
    <>
      <Stack className="pb-6">
        <Content />
      </Stack>
      <Row className="sticky bottom-0 p-4 bg-white rounded-t-md border border-b-0 border-gray5 w-[800px] justify-center">
        <LegalConfirmationButton
          name={name}
          version={latestLegalVersions[`${name}Version`]}
        />
      </Row>
    </>
  );
}
