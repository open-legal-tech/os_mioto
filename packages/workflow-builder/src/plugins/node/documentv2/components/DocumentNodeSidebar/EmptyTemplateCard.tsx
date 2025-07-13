import { buttonClasses } from "@mioto/design-system/Button";
import { FileDropzone } from "@mioto/design-system/FileDropzone";
import { Notification } from "@mioto/design-system/Notification";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { Failure } from "@mioto/errors";
import { useTranslations } from "@mioto/locale";
import React from "react";
import type { TNodeId } from "../../../../../tree/id";
import { useTreeClient } from "../../../../../tree/sync/state";
import { DocumentNode } from "../../plugin";
import { TemplateError } from "./TemplateError";
import { createTemplateAction } from "./template.actions";
import { uploadFile } from "./uploadFile";
import { maxTemplateSize } from "../constants";

type EmptyTemplateCardProps = { nodeId: TNodeId; treeUuid: string };

export const EmptyTemplateCard = ({
  nodeId,
  treeUuid,
}: EmptyTemplateCardProps) => {
  const t = useTranslations();
  const { treeClient } = useTreeClient();
  const [isLoading, startTransition] = React.useTransition();

  return (
    <FileDropzone
      maxFiles={1}
      className={buttonClasses({})}
      Label={t("plugins.node.document.template-card.upload.label")}
      maxSize={maxTemplateSize}
      onValidFileDrop={(acceptedFiles) => {
        startTransition(async () => {
          const file = acceptedFiles[0];

          if (!file) return;

          const uploadedFile = await uploadFile(file, maxTemplateSize);

          if (uploadedFile instanceof Failure) {
            if (uploadedFile.code === "upload_failed") {
              return Notification.add({
                Title: t(
                  "plugins.node.document.template-card.notification.upload-failed.title",
                ),
                Content: t(
                  "plugins.node.document.template-card.notification.upload-failed.content",
                ),
              });
            }
            if (uploadedFile.code === "size_too_large") {
              return Notification.add({
                Title: t(
                  "plugins.node.document.template-card.notification.size_too_large.title",
                ),
                Content: t(
                  "plugins.node.document.template-card.notification.size_too_large.content",
                ),
                variant: "danger",
              });
            }
            return Notification.add({
              Title: t(
                "plugins.node.document.template-card.notification.invalid_file_type.title",
              ),
              Content: t(
                "plugins.node.document.template-card.notification.invalid_file_type.content",
              ),
              variant: "danger",
            });
          }

          const result = await createTemplateAction({
            treeUuid,
            fileUuid: uploadedFile.uuid,
          });

          if (!result.success) {
            return Notification.add({
              Title: t(
                "plugins.node.document.template-card.notification.invalid_file_type.title",
              ),
              Content: t(
                "plugins.node.document.template-card.notification.invalid_file_type.content",
              ),
              variant: "danger",
              explanation: () =>
                result.failure.additionalData &&
                result.failure.additionalData.length > 0 ? (
                  <Stack className="gap-2">
                    <Text className="font-strong">
                      {t(
                        "plugins.node.document.template-card.notification.invalid_file_type.explanation.title",
                      )}
                    </Text>
                    {result.failure.additionalData.map(
                      (templateError, index) => {
                        if (!templateError) return null;
                        return (
                          <TemplateError
                            templateError={templateError}
                            key={`${templateError.tag}-${templateError.tag}`}
                          />
                        );
                      },
                    )}
                  </Stack>
                ) : null,
            });
          }

          DocumentNode.updateTemplateUuid(
            nodeId,
            result.data.treeInternalUuid,
          )(treeClient);
        });
      }}
      isLoading={isLoading}
      accept={{
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
      }}
    />
  );
};
