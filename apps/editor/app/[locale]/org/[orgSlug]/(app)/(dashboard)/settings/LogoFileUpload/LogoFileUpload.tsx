"use client";

import type { TExistingFile } from "@mioto/design-system/FileDropzone";
import { FileCard } from "@mioto/design-system/FileDropzone";
import { Notification } from "@mioto/design-system/Notification";
import { useTranslations } from "@mioto/locale";
import { logoDeleteAction } from "./logoDelete.action";
import { logoUploadAction } from "./logoUpload.action";
import { logoUrlChangeAction } from "./logoUrlChange.action";

export function LogoFileUpload({
  existingLogo,
}: {
  existingLogo?: TExistingFile;
}) {
  const t = useTranslations();

  return (
    <FileCard
      existingFile={existingLogo}
      accept={{ "image/png": [".png"], "image/jpeg": [".jpeg", ".jpg"] }}
      title="Logo"
      onUpload={async (formData) => {
        const result = await logoUploadAction(formData);

        if (!result.success) {
          return Notification.add({
            Title: t(
              "app.settings.logo-upload.notification.unknown-error.title",
            ),
            Content: t(
              "app.settings.logo-upload.notification.unknown-error.content",
            ),
            variant: "danger",
          });
        }
      }}
      onDelete={() => {
        logoDeleteAction();
      }}
      Heading={t("app.settings.logo-upload.label")}
      onUrlChange={(newUrl) => {
        logoUrlChangeAction({ newUrl });
      }}
      placeholder="https://example.com/logo.png"
    />
  );
}
