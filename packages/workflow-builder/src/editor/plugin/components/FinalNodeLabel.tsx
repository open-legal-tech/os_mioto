import { Badge } from "@mioto/design-system/Badge";
import { Moon } from "@phosphor-icons/react/dist/ssr";

import { twMerge } from "@mioto/design-system/tailwind/merge";
import { useTranslations } from "@mioto/locale";

type Props = { className?: string };

export function FinalNodeLabel({ className }: Props) {
  const t = useTranslations();

  return (
    <Badge
      className={twMerge("colorScheme-warning", className)}
      data-testid="node-label"
    >
      <Moon />
      {t("packages.node-editor.nodeEditingSidebar.nodeLabels.finalNode")}
    </Badge>
  );
}
