import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { Notification } from "@mioto/design-system/Notification";
import { useTranslations } from "@mioto/locale";
import { Download } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { exportTreeAction } from "../../../db/exports/exportTree.action";

export type ExportItemProps = {
  treeUuid: string;
  onBeforeExport?: () => Promise<void> | void;
};

export const ExportItem = ({ treeUuid, onBeforeExport }: ExportItemProps) => {
  const [file, setFile] = React.useState<
    undefined | { name: string; url: string }
  >(undefined);

  const t = useTranslations();

  return !file ? (
    <DropdownMenu.Item
      onAsyncSelect={async () => {
        await onBeforeExport?.();
        const result = await exportTreeAction({ treeUuid });

        if (result.data.failure) {
          Notification.add({
            Title: t("components.project-menu.export.errors.unknown.title"),
            Content: t("components.project-menu.export.errors.unknown.content"),
            variant: "warning",
            key: "create-version-success",
          });
        }
        const blob = new Blob([result.data.file], {
          type: "application/json",
        });

        const fileUrl = URL.createObjectURL(blob);

        setFile({ name: result.data.fileName, url: fileUrl });
      }}
      Icon={<Download />}
    >
      {t("components.project-menu.export.button")}
    </DropdownMenu.Item>
  ) : (
    <DropdownMenu.Item Icon={<Download />} download={file.name} href={file.url}>
      {t("components.project-menu.export.saveButton")}
    </DropdownMenu.Item>
  );
};
