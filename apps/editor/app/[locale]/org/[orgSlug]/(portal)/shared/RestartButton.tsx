"use client";

import { ButtonLink } from "@mioto/design-system/Button";
import { useTranslations } from "next-intl";

export function RestartButton({ treeUuid }: { treeUuid: string }) {
  const t = useTranslations();

  return (
    <ButtonLink href={`/render/${treeUuid}`} orgLink>
      {t("renderer.navigation.restart")}
    </ButtonLink>
  );
}
