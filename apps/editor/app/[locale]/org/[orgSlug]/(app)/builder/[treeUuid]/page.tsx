import { Row } from "@mioto/design-system/Row";
import { setRequestLocale } from "@mioto/locale/server";
import { Editor } from "@mioto/workflow-builder/editor/components/Editor";
import { notFound } from "next/navigation";
import { z } from "zod";
import { InfoDropdown } from "../../../../../../shared/InfoDropdown";
import { generateMiotoMetadata } from "../../../../../../shared/generateMiotoMetadata";
import { LanguageToggle } from "../../shared/components/LanguageToggle";
import { UserMenu } from "../../shared/components/UserMenu";

export const generateMetadata = generateMiotoMetadata((t) => ({
  title: t("app.editor.pageTitle"),
}));

export default async function EditorPage(props: {
  params: Promise<{
    treeUuid: string;
    locale: string;
  }>;
}) {
  const params = await props.params;

  const { treeUuid, locale } = params;

  setRequestLocale(locale);

  const validTreeUuid = z.string().uuid().safeParse(treeUuid);
  if (!validTreeUuid.success) {
    notFound();
  }

  return (
    <Editor
      HeaderRightSlot={
        <Row className="items-center">
          <LanguageToggle />
          <UserMenu />
        </Row>
      }
      SideMenuBottomSlot={<InfoDropdown />}
      treeUuid={treeUuid}
      onTreeNotFound={notFound}
    />
  );
}
