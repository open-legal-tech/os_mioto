import { Button } from "@mioto/design-system/Button";
import { useContactForm } from "@mioto/design-system/ContactForm";
import { SupportDialog } from "@mioto/design-system/SupportDialog";
import { useTranslations } from "@mioto/locale";
import React from "react";
import type { ValidationError } from "../../tree/sync/websocket.machine";

type BrokenTreeSupportDialogProps = {
  validationError: Required<ValidationError>;
  userEmail?: string;
};

export const BrokenTreeSupportDialog = ({
  validationError,
  userEmail,
}: BrokenTreeSupportDialogProps) => {
  const contactForm = useContactForm({
    attachment: [
      {
        name: "Projektinhalt.json",
        contentInBase64: Buffer.from(
          JSON.stringify(validationError.migrationResult),
        ).toString("base64"),
        contentType: "text/plain",
      },
      {
        name: "Validierungsfehler.json",
        contentInBase64: Buffer.from(
          JSON.stringify(validationError.failure.body().parentError),
        ).toString("base64"),
        contentType: "text/plain",
      },
    ],
    defaultValues: {
      email: userEmail ?? "",
    },
  });

  const t = useTranslations();
  const [open, setOpen] = React.useState(false);

  return (
    <SupportDialog
      open={open}
      onCancel={() => setOpen(false)}
      contactForm={contactForm}
      addedData={["Projektinhalt", "Validierungsfehler"]}
    >
      <Button>{t("app.editor.broken-tree.dialog.submit")}</Button>
    </SupportDialog>
  );
};
