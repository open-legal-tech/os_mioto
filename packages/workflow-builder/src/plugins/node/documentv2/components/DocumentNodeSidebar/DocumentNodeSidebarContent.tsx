"use client";

import { sidebarCardClasses } from "@mioto/design-system/Card";
import { Form } from "@mioto/design-system/Form";
import Heading from "@mioto/design-system/Heading";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { Row } from "@mioto/design-system/Row";
import { Skeleton } from "@mioto/design-system/Skeleton";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import {
  NodeSidebarTab,
  useSidebarContext,
} from "../../../../../editor/components/NodeSidebar";
import { useTree, useTreeClient } from "../../../../../tree/sync/state";
import { DocumentNode } from "../../plugin";
import { EmptyTemplateCard } from "./EmptyTemplateCard";
import { SelectOutputType } from "./SelectOutputType";
import { TemplateCard } from "./TemplateCard";
import { UpdateTemplateButton } from "./UpdateTemplateButton";

type Props = { treeUuid: string; files: Record<string, string> };

export function DocumentNodeSidebarContent({ treeUuid, files }: Props) {
  const nodeId = useSidebarContext();
  const { treeClient } = useTreeClient();

  const node = useTree((treeClient) => {
    return DocumentNode.getSingle(nodeId)(treeClient);
  });

  const methods = Form.useForm({
    defaultValues: {
      documentName: node?.documentName,
    },
  });

  const t = useTranslations();
  const fileName = files[nodeId];

  return (
    <NodeSidebarTab value="content">
      <Stack className="gap-6 p-4">
        <Stack className={sidebarCardClasses("p-4 gap-6")}>
          <Row className="justify-between items-center">
            <Row className="gap-2">
              <Heading size="extra-small">
                {t("plugins.node.document.title.text")}
              </Heading>

              <HelpTooltip>
                {t("plugins.node.document.title.help-tooltip.content")}
              </HelpTooltip>
            </Row>
            {node.templateUuid ? (
              <UpdateTemplateButton
                templateUuid={node.templateUuid}
                treeUuid={treeUuid}
                nodeId={nodeId}
              />
            ) : null}
          </Row>
          {node.templateUuid ? (
            fileName ? (
              <TemplateCard
                fileName={fileName}
                nodeId={nodeId}
                templateUuid={node.templateUuid}
                treeUuid={treeUuid}
              />
            ) : (
              <Row className="items-center gap-2 justify-between h-[34px]">
                <Skeleton className="w-[100px] h-[20px] rounded" />
                <Row className="gap-2">
                  <Skeleton className="w-[20px] h-[20px] rounded" />
                  <Skeleton className="w-[20px] h-[20px] rounded" />
                </Row>
              </Row>
            )
          ) : (
            <EmptyTemplateCard nodeId={nodeId} treeUuid={treeUuid} />
          )}
          <Form.Provider methods={methods}>
            <Form.Root className="gap-4">
              <Form.Field Label={t("plugins.node.document.name.label")}>
                <Form.Input
                  {...methods.register("documentName", {
                    onChange: (event) =>
                      DocumentNode.updateDocumentName(
                        nodeId,
                        event.target.value,
                      )(treeClient),
                  })}
                />
              </Form.Field>
              <SelectOutputType nodeId={nodeId} />
            </Form.Root>
          </Form.Provider>
        </Stack>
      </Stack>
    </NodeSidebarTab>
  );
}
