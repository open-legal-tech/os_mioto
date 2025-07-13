import { useTranslations } from "@mioto/locale";
import { NotFound } from "../../../../../../../shared/error/NotFound/NotFound";

export const EditorNotFound = () => {
  const t = useTranslations();

  return (
    <NotFound
      heading={t("app.editor.not-found.title")}
      content={t("app.editor.not-found.content")}
    />
  );
};
