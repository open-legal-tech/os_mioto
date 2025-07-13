import Badge, { type BadgeProps } from "@mioto/design-system/Badge";
import { useTranslations } from "@mioto/locale";
import type { Client } from "./ClientType";
import { statusMap } from "./clientStatusMap";

export const ClientStatusBadge = ({
  status,
  ...props
}: { status: Client["status"] } & BadgeProps) => {
  const t = useTranslations();
  const statusMapEntry = statusMap[status];

  return (
    <Badge colorScheme={statusMapEntry.colorScheme} {...props}>
      {t(statusMapEntry.label)}
    </Badge>
  );
};
