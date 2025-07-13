"use client";

import type { TExistingFile } from "@mioto/design-system/FileDropzone";
import { FileCard } from "@mioto/design-system/FileDropzone";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { Notification } from "@mioto/design-system/Notification";
import { useTranslations } from "@mioto/locale";
import { privacyDeleteAction } from "./privacyDelete.action";
import { privacyUploadAction } from "./privacyUpload.action";
import { privacyUrlChangeAction } from "./privacyUrlChange.action";

export function PrivacyFileDropzone({
  existingPrivacy,
}: {
  existingPrivacy?: TExistingFile;
}) {
  const t = useTranslations();

  return (
    <FileCard
      accept={{ "application/pdf": [".pdf"] }}
      url={existingPrivacy?.url}
      onUrlChange={(newUrl) => {
        privacyUrlChangeAction({ newUrl });
      }}
      placeholder={t("app.settings.privacy-upload.placeholder")}
      title={t("app.settings.privacy-upload.title")}
      Heading={
        <>
          {t("app.settings.privacy-upload.title")}
          <PrivacyHelpTooltip className="inline-flex relative -top-[1px]" />
        </>
      }
      existingFile={existingPrivacy}
      onDelete={() => {
        privacyDeleteAction();
      }}
      onUpload={async (formData) => {
        const result = await privacyUploadAction(formData);

        if (!result.success) {
          return Notification.add({
            Title: t(
              "app.settings.privacy-upload.notification.unknown-error.title",
            ),
            Content: t(
              "app.settings.privacy-upload.notification.unknown-error.content",
            ),
            variant: "danger",
          });
        }
      }}
    />
  );
}

const PrivacyHelpTooltip = ({ className }: { className?: string }) => {
  const t = useTranslations();

  return (
    <HelpTooltip className={className}>
      {t.rich("app.settings.privacy-upload.help-tooltip.content")}
    </HelpTooltip>
  );
};
