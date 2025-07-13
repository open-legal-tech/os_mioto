"use client";

import { Form } from "@mioto/design-system/Form";
import Heading from "@mioto/design-system/Heading";
import { headingClasses } from "@mioto/design-system/Heading/classes";
import Label from "@mioto/design-system/Label";
import { Stack } from "@mioto/design-system/Stack";
import { useLocale, useTranslations } from "@mioto/locale";
import { NodeSidebar } from "../../../../../editor/components/NodeSidebar";
import { RichTextEditor } from "../../../../../rich-text-editor/exports/RichText/RichTextEditor";
import {
  getNodeContentFromYDoc,
  useTree,
  useTreeClient,
  useTreeContext,
} from "../../../../../tree/sync/state";
import { InfoNode } from "../../exports/plugin";

export function InfoNodeSidebarContent() {
  const nodeId = NodeSidebar.useSidebarContext();
  const locale = useLocale();
  const t = useTranslations();
  const { treeClient } = useTreeClient();
  const { treeMap } = useTreeContext();
  const yContent = getNodeContentFromYDoc(treeMap, nodeId);

  const node = useTree(InfoNode.getSingle(nodeId));

  const methods = Form.useForm({
    defaultValues: {
      rendererButtonLabel: node.rendererButtonLabel,
    },
  });

  return (
    <NodeSidebar.Tab value="content">
      <Stack className="gap-6 p-4">
        <section>
          <RichTextEditor
            maxHeight={400}
            data-test="richTextEditor"
            yContent={yContent}
            Label={(props) => (
              <Label
                className={headingClasses({
                  size: "tiny",
                  className: "mb-2",
                })}
                {...props}
              >
                {t(
                  "packages.node-editor.nodeEditingSidebar.richTextEditor.label",
                )}
              </Label>
            )}
          />
        </section>
        <section>
          <Heading level={3} size="tiny" className="mb-2">
            {t("plugins.node.info.renderer-configuration.label")}
          </Heading>
          <Form.Provider methods={methods}>
            <Form.Root>
              <Form.Field
                Label={t(
                  "plugins.node.info.renderer-configuration.button-label.label",
                )}
              >
                <Form.Input
                  {...methods.register("rendererButtonLabel", {
                    onChange: (event) =>
                      InfoNode.updateRendererButtonLabel(
                        nodeId,
                        event.target.value,
                      )(treeClient),
                  })}
                />
              </Form.Field>
            </Form.Root>
          </Form.Provider>
        </section>
      </Stack>
    </NodeSidebar.Tab>
  );
}
