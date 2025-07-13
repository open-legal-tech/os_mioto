"use client";

import type { TExistingFile } from "@mioto/design-system/FileDropzone";
import { FileCard } from "@mioto/design-system/FileDropzone";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { Notification } from "@mioto/design-system/Notification";
import { useTranslations } from "@mioto/locale";
import { agbDeleteAction } from "./agbDelete.action";
import { agbUploadAction } from "./agbUpload.action";
import { agbUrlChangeAction } from "./agbUrlChange.action";

export function AGBFileDropzone({
  existingAGB,
}: {
  existingAGB?: TExistingFile;
}) {
  const t = useTranslations();

  return (
    <FileCard
      accept={{ "application/pdf": [".pdf"] }}
      url={existingAGB?.url}
      onUrlChange={(newUrl) => {
        agbUrlChangeAction({ newUrl });
      }}
      placeholder={t("app.settings.terms-upload.placeholder")}
      title={t("app.settings.terms-upload.title")}
      existingFile={existingAGB}
      Heading={
        <>
          {t("app.settings.terms-upload.title")}
          <AGBHelpTooltip className="inline-flex relative -top-[1px]" />
        </>
      }
      onDelete={() => {
        agbDeleteAction();
      }}
      onUpload={async (formData) => {
        const result = await agbUploadAction(formData);

        if (!result.success) {
          return Notification.add({
            Title: t(
              "app.settings.terms-upload.notification.unknown-error.title",
            ),
            Content: t(
              "app.settings.terms-upload.notification.unknown-error.content",
            ),
            variant: "danger",
          });
        }
      }}
    />
  );
}

const AGBHelpTooltip = ({ className }: { className?: string }) => {
  const t = useTranslations();

  return (
    <HelpTooltip className={className}>
      {t.rich("app.settings.terms-upload.help-tooltip.content")}
    </HelpTooltip>
  );
};
