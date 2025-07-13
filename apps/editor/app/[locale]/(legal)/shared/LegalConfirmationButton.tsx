"use client";

import { Notification } from "@mioto/design-system/Notification";
import SubmitButton from "@mioto/design-system/SubmitButton";
import * as React from "react";
import type { LegalPages } from "../../../../content/legal";
import { updateAcceptedTerms } from "./confirmationAction";

export type LegalConfirmationButtonProps = {
  className?: string;
  onConfirm?: () => void;
  name: LegalPages;
  version: number;
};

export const LegalConfirmationButton = ({
  onConfirm,
  className,
  name,
  version,
}: LegalConfirmationButtonProps) => {
  const [isPending, startTransition] = React.useTransition();
  const [hasAccepted, setHasAccepted] = React.useState(false);

  return (
    <SubmitButton
      type="button"
      isLoading={isPending}
      onClick={() =>
        startTransition(async () => {
          await updateAcceptedTerms({ name, version });
          onConfirm?.();
          setHasAccepted(true);
          Notification.add({
            Title: "Erfolgreich akzeptiert",
            Content: "Der Tab kann nun geschlossen werden",
            variant: "success",
          });
        })
      }
      disabled={hasAccepted}
      className={className}
    >
      {hasAccepted ? "Erfolgreich akzeptiert" : "Akzeptieren"}
    </SubmitButton>
  );
};
