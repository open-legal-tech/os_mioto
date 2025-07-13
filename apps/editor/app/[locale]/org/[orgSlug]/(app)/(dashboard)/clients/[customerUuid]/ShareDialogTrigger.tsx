"use client";

import { Button } from "@mioto/design-system/Button";
import { DialogRoot } from "@mioto/design-system/Dialog";
import { useTranslations } from "@mioto/locale";
import React from "react";

export function ShareDialogTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <Button size="small">
        {t("app.client.page.shared-apps.share-button")}
      </Button>
      {children}
    </DialogRoot>
  );
}
