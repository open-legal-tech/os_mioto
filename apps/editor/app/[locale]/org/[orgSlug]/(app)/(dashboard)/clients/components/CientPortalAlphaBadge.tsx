import Badge from "@mioto/design-system/Badge";
import { useTranslations } from "@mioto/locale";

export function ClientPortalAlphaBadge() {
  const t = useTranslations();

  return (
    <Badge
      tooltip={{
        children: t("app.client.alpha-badge.tooltip.content"),
      }}
    >
      {t("app.client.alpha-badge.title")}
    </Badge>
  );
}
