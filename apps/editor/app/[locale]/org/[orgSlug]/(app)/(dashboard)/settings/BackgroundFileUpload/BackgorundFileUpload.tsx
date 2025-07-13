"use client";

import type { TExistingFile } from "@mioto/design-system/FileDropzone";
import { FileCard } from "@mioto/design-system/FileDropzone";
import { Notification } from "@mioto/design-system/Notification";
import { useTranslations } from "@mioto/locale";
import { backgroundDeleteAction } from "./backgroundDelete.action";
import { backgroundUploadAction } from "./backgroundUpload.action";
import { backgroundUrlChangeAction } from "./backgroundUrlChange.action";

export function BackgroundFileUpload({
  existingBackground,
}: {
  existingBackground?: TExistingFile;
}) {
  const t = useTranslations();

  return (
    <FileCard
      existingFile={existingBackground}
      accept={{ "image/png": [".png"], "image/jpeg": [".jpeg", ".jpg"] }}
      title={t("app.settings.background-upload.title")}
      onUpload={async (formData) => {
        const result = await backgroundUploadAction(formData);

        if (!result.success) {
          return Notification.add({
            Title: t(
              "app.settings.background-upload.notification.unknown-error.title",
            ),
            Content: t(
              "app.settings.background-upload.notification.unknown-error.content",
            ),
            variant: "danger",
          });
        }
      }}
      onDelete={() => {
        backgroundDeleteAction();
      }}
      Heading={t("app.settings.background-upload.label")}
      onUrlChange={(newUrl) => {
        backgroundUrlChangeAction({ newUrl });
      }}
      placeholder="https://example.com/logo.png"
    />
  );
}
