"use client";

import { badgeClasses } from "@mioto/design-system/Badge";
import { Button } from "@mioto/design-system/Button";
import { useContactForm } from "@mioto/design-system/ContactForm";
import Heading from "@mioto/design-system/Heading";
import { Popover } from "@mioto/design-system/Popover";
import { SupportDialog } from "@mioto/design-system/SupportDialog";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import React from "react";

export function AlphaBadge({ userEmail }: { userEmail?: string }) {
  const contactForm = useContactForm({
    defaultValues: {
      email: userEmail,
    },
  });

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [isPopoverOpen, setPopoverOpen] = React.useState(false);
  const t = useTranslations();

  return (
    <>
      <SupportDialog
        contactForm={contactForm}
        open={isDialogOpen}
        onCancel={() => setDialogOpen(false)}
      />
      <Popover.Root open={isPopoverOpen} onOpenChange={setPopoverOpen}>
        <Popover.Trigger asChild>
          <Button
            variant="tertiary"
            className={badgeClasses({ colorScheme: "danger" })}
          >
            Alpha
          </Button>
        </Popover.Trigger>
        <Popover.Content className="max-w-[400px] p-6">
          <Heading size="small" className="mb-2">
            {t("app.editor.mioto-mind.alpha-badge.title")}
          </Heading>
          <Text>{t("app.editor.mioto-mind.alpha-badge.description")}</Text>
          <Button
            variant="secondary"
            className="ml-auto mt-4"
            onClick={() => {
              setDialogOpen(true);
              setPopoverOpen(false);
            }}
          >
            {t("app.editor.mioto-mind.alpha-badge.contact-button")}
          </Button>
        </Popover.Content>
      </Popover.Root>
    </>
  );
}
