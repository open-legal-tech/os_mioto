import { buttonClasses } from "@mioto/design-system/Button";
import { FileDropzone } from "@mioto/design-system/FileDropzone";
import { Notification } from "@mioto/design-system/Notification";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { Failure } from "@mioto/errors";
import { useTranslations } from "@mioto/locale";
import React from "react";
import type { TNodeId } from "../../../../../tree/id";
import { useTreeClient } from "../../../../../tree/sync/treeStore/TreeContext";
import { DocumentNode } from "../../plugin";
import { TemplateError } from "./TemplateError";
import { updateTemplateAction } from "./template.actions";
import { uploadFile } from "./uploadFile";
import { maxTemplateSize } from "../constants";

type UpdateTemplateButtonProps = {
  templateUuid: string;
  treeUuid: string;
  nodeId: TNodeId;
};

export const UpdateTemplateButton = ({
  templateUuid,
  treeUuid,
  nodeId,
}: UpdateTemplateButtonProps) => {
  const [isLoading, startTransition] = React.useTransition();
  const t = useTranslations();
  const { treeClient } = useTreeClient();

  return (
    <FileDropzone
      maxFiles={1}
      className={buttonClasses({ variant: "secondary", size: "small" })}
      Label={t("plugins.node.document.template-card.update.label")}
      onValidFileDrop={(acceptedFiles) => {
        startTransition(async () => {
          const file = acceptedFiles[0];

          if (!file) return;

          const uploadedFileUrl = await uploadFile(file, maxTemplateSize);

          if (uploadedFileUrl instanceof Failure) {
            if (uploadedFileUrl.code === "upload_failed") {
              return Notification.add({
                Title: t(
                  "plugins.node.document.template-card.notification.upload-failed.title",
                ),
                Content: t(
                  "plugins.node.document.template-card.notification.upload-failed.content",
                ),
              });
            }
            if (uploadedFileUrl.code === "size_too_large") {
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

          const result = await updateTemplateAction({
            fileUuid: uploadedFileUrl.uuid,
            treeUuid,
            treeInternalTemplateUuid: templateUuid,
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
              explanation:
                result.failure.additionalData &&
                result.failure.additionalData.length > 0
                  ? () => (
                      <Stack className="gap-2">
                        <Text className="font-strong">
                          {t(
                            "plugins.node.document.template-card.notification.invalid_file_type.explanation.title",
                          )}
                        </Text>
                        {result.failure.additionalData?.map(
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
                    )
                  : undefined,
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
