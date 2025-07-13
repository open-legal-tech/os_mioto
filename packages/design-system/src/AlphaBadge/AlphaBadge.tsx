import { useTranslations } from "@mioto/locale";
import Badge from "../Badge";

export function AlphaBadge() {
  const t = useTranslations();

  return <Badge>{t("components.alphabadge.label")}</Badge>;
}
