"use client";

import { cardClasses } from "@mioto/design-system/Card";
import Heading from "@mioto/design-system/Heading";
import { rowClasses } from "@mioto/design-system/Row";
import SubmitButton from "@mioto/design-system/SubmitButton";
import { useTranslations } from "@mioto/locale";
import { deleteAdminUserAction } from "@mioto/server/actions/deleteUser.action";
import * as React from "react";
import { VerifiedSettingsChange } from "./VerifiedSettingsChange";

type Props = { userEmail: string };

export function DeleteAccount({ userEmail }: Props) {
  const t = useTranslations();
  const [isLoading, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  return (
    <VerifiedSettingsChange
      email={userEmail}
      onVerify={() => {
        startTransition(async () => {
          await deleteAdminUserAction();

          setOpen(false);
        });
      }}
      open={open}
      setOpen={setOpen}
      description={t("app.settings.deleteAccount.verifyOverlay.description")}
      additionalMessage={{
        variant: "danger",
        Title: t(
          "app.settings.deleteAccount.verifyOverlay.additionalMessage.title",
        ),
        Content: t(
          "app.settings.deleteAccount.verifyOverlay.additionalMessage.content",
        ),
        className: "bg-danger2",
      }}
      colorScheme="danger"
    >
      <div
        className={cardClasses([rowClasses(), "justify-between items-center"])}
      >
        <Heading level={3} size="extra-small">
          {t("app.settings.deleteAccount.title")}
        </Heading>
        <SubmitButton
          onClick={() => setOpen(true)}
          isLoading={isLoading}
          colorScheme="danger"
          className="self-end"
        >
          {t("app.settings.deleteAccount.submit")}
        </SubmitButton>
      </div>
    </VerifiedSettingsChange>
  );
}
