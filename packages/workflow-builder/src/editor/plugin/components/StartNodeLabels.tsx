import Badge from "@mioto/design-system/Badge";

import { twMerge } from "@mioto/design-system/tailwind/merge";
import { useTranslations } from "@mioto/locale";
import { Rocket } from "@phosphor-icons/react/dist/ssr";

type Props = { className?: string };

export function StartNodeLabel({ className }: Props) {
  const t = useTranslations();

  return (
    <Badge
      className={twMerge("colorScheme-success", className)}
      data-testid="node-label"
    >
      <Rocket />
      {t("packages.node-editor.nodeEditingSidebar.nodeLabels.startNode")}
    </Badge>
  );
}
