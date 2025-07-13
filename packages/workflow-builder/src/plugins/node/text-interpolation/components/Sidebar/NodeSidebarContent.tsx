"use client";

import { Form } from "@mioto/design-system/Form";
import { headingClasses } from "@mioto/design-system/Heading/classes";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import Label from "@mioto/design-system/Label";
import { Stack } from "@mioto/design-system/Stack";
import { useLocale, useTranslations } from "@mioto/locale";
import { useSidebarContext } from "../../../../../editor/components/NodeEditor/Canvas/Sidebar";
import { NodeSidebar } from "../../../../../editor/components/NodeSidebar";
import { useEditorVariables } from "../../../../../editor/useEditorVariables";
import { RichTextEditor } from "../../../../../rich-text-editor/exports/RichText/RichTextEditor";
import {
  getNodeContentFromYDoc,
  useTree,
  useTreeClient,
  useTreeContext,
} from "../../../../../tree/sync/state";
import type {
  INumberVariable,
  IRichTextVariable,
  ISelectVariable,
  ITextVariable,
} from "../../../../../variables/exports/types";
import { TextInterpolationNode } from "../../plugin";

export function TextInterpolationSidebarContent() {
  const nodeId = useSidebarContext();
  const locale = useLocale();
  const t = useTranslations();
  const { treeMap } = useTreeContext();
  const yContent = getNodeContentFromYDoc(treeMap, nodeId);

  const variables = useEditorVariables({
    excludeIds: [nodeId],
    filterPrimitives: (
      variable,
    ): variable is ITextVariable | ISelectVariable | INumberVariable =>
      variable.type === "select" ||
      variable.type === "text" ||
      variable.type === "number",
  });

  const richTextVariables = useEditorVariables({
    excludeIds: [nodeId],
    filterPrimitives: (variable): variable is IRichTextVariable =>
      variable.type === "rich-text",
  });

  const node = useTree(TextInterpolationNode.getSingle(nodeId));
  const { treeClient } = useTreeClient();

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
          <Form.Field
            className="mt-1"
            Label={t("plugins.node.text-interpolation.formatted.label")}
            layout="constrained-right"
            TopRight={(props) => (
              <HelpTooltip className="p-0" {...props}>
                {t(
                  "plugins.node.text-interpolation.formatted.help-tooltip.content",
                )}
              </HelpTooltip>
            )}
          >
            <Form.Checkbox
              id="isFormatted"
              checked={node.isFormatted ?? false}
              onChange={(event) => {
                const node =
                  TextInterpolationNode.getSingle(nodeId)(treeClient);

                node.isFormatted = event.target.checked;
              }}
            />
          </Form.Field>
        </section>
      </Stack>
    </NodeSidebar.Tab>
  );
}
