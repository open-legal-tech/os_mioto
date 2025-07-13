"use client";

import { Button } from "@mioto/design-system/Button";
import { useContactForm } from "@mioto/design-system/ContactForm";
import { SupportDialog } from "@mioto/design-system/SupportDialog";
import type { ColorKeys } from "@mioto/design-system/utils/types";
import { useTranslations } from "@mioto/locale";
import React from "react";
import { usePathname } from "../../../i18n/routing";

type Props = {
  className?: string;
  contactEmail?: string;
  colorScheme?: ColorKeys;
};

export function ContactSupport({
  className,
  contactEmail,
  colorScheme,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const contactForm = useContactForm({
    attachment: [
      {
        name: "Aktuelle Url",
        contentInBase64: Buffer.from(pathname).toString("base64"),
        contentType: "text/plain",
      },
    ],
    defaultValues: {
      email: contactEmail,
    },
  });

  const t = useTranslations();

  return (
    <SupportDialog
      open={open}
      onCancel={() => setOpen(false)}
      className={className}
      contactForm={contactForm}
      addedData={["Aktuelle Url"]}
    >
      <Button colorScheme={colorScheme}>
        {t("error.contact-support.button")}
      </Button>
    </SupportDialog>
  );
}
