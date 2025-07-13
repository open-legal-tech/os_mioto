import { IconButton } from "@mioto/design-system/IconButton";
import { Notification } from "@mioto/design-system/Notification";
import { Row } from "@mioto/design-system/Row";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import { File, X } from "@phosphor-icons/react";
import React from "react";
import type { TNodeId } from "../../../../../tree/id";
import { useTreeClient } from "../../../../../tree/sync/state";
import { DocumentNode } from "../../plugin";
import { TemplateDownloadLink } from "./TemplateDownloadLink";
import { deleteTemplateAction } from "./template.actions";

type TemplateCardProps = {
  nodeId: TNodeId;
  templateUuid: string;
  treeUuid: string;
  fileName?: string;
};

export const TemplateCard = ({
  nodeId,
  templateUuid,
  treeUuid,
  fileName,
}: TemplateCardProps) => {
  const t = useTranslations();
  const { treeClient } = useTreeClient();
  const [isLoading, startTransition] = React.useTransition();

  if (!fileName) return null;

  return (
    <Row className="justify-between items-center">
      <Row className="gap-1 items-center">
        <File />
        <Text className="break-all">{fileName}</Text>
      </Row>
      <Row className="gap-2 items-center">
        <Row>
          <TemplateDownloadLink
            templateUuid={templateUuid}
            treeUuid={treeUuid}
          />
          <IconButton
            tooltip={{
              children: t("plugins.node.document.template-card.remove.label"),
            }}
            variant="tertiary"
            colorScheme="gray"
            size="small"
            isLoading={isLoading}
            onClick={() => {
              startTransition(async () => {
                const result = await deleteTemplateAction({
                  treeInternalTemplateUuid: templateUuid,
                  treeUuid,
                });

                if (!result.success) {
                  return Notification.add({
                    Title: t(
                      "plugins.node.document.template-card.remove.notification.error.title",
                    ),
                    Content: t(
                      "plugins.node.document.template-card.remove.notification.error.content",
                    ),
                    variant: "danger",
                  });
                }

                DocumentNode.deleteTemplateUuid(nodeId)(treeClient);
              });
            }}
          >
            <X />
          </IconButton>
        </Row>
      </Row>
    </Row>
  );
};
