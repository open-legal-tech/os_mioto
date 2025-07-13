"use client";

import { Button } from "@mioto/design-system/Button";
import { useContactForm } from "@mioto/design-system/ContactForm";
import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { SupportDialog } from "@mioto/design-system/SupportDialog";
import { useTranslations } from "@mioto/locale";
import { Info } from "@phosphor-icons/react/dist/ssr";
import * as React from "react";

type Props = {
  userEmail?: string;
};

export const InfoDropdown = ({ userEmail }: Props) => {
  const supportItemRef = React.useRef<HTMLDivElement>(null);

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState<"support" | undefined>(
    undefined,
  );

  const contactForm = useContactForm({
    defaultValues: {
      email: userEmail,
    },
  });

  const dialogs = {
    support: () => (
      <SupportDialog
        open={openDialog === "support"}
        onCancel={() => {
          setOpenDialog(undefined);
        }}
        contactForm={contactForm}
      />
    ),
  };

  const t = useTranslations();

  return (
    <>
      <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenu.Trigger asChild>
          <Button variant="tertiary" square className="colorScheme-gray">
            <Info />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content side="right" sideOffset={15} align="end">
          <DropdownMenu.Item href="/privacy" target="_blank">
            {t("components.info-dropdown.privacy.label")}
          </DropdownMenu.Item>
          <DropdownMenu.Item href="/imprint" target="_blank">
            {t("components.info-dropdown.imprint.label")}
          </DropdownMenu.Item>
          <DropdownMenu.Item href="/terms" target="_blank">
            {t("components.info-dropdown.terms.label")}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => {
              setOpenDialog("support");
              setDropdownOpen(false);
            }}
            ref={supportItemRef}
          >
            {t("components.info-dropdown.contact-support")}
          </DropdownMenu.Item>
          <DropdownMenu.Item href="/docs" target="_blank">
            {t("components.info-dropdown.documentation.label")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {openDialog ? dialogs[openDialog]?.() : null}
    </>
  );
};
