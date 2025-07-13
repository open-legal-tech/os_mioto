import { Row } from "@mioto/design-system/Row";
import { Tooltip } from "@mioto/design-system/Tooltip";
import { useTranslations } from "@mioto/locale";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { VariableTypeIcon } from "../../../editor/components/NodeTypeIcon";
import { getRecordVariable } from "../../../variables/utils/getRecordVariable";
import { getVariable } from "../../../variables/utils/getVariable";
import { VariableBadge } from "../../components/VariableBadge";
import { RichTextRenderer } from "../../exports/RichText/RichTextRenderer";
import type { VariableExtensionsParams } from "../../types/VariablePlugins";
import { createVariableNameString } from "../../utils/createVariableNameString";
import { HeadlessRichTextVariableExtensions } from "./headlessExtension";

function RichTextVariable({
  richTextVariables = {},
  variables = {},
  fileVariables = {},
  node,
  editor,
  selected,
}: VariableExtensionsParams & NodeViewProps) {
  const t = useTranslations();
  const variable = getVariable(richTextVariables, node.attrs.id);
  const recordVariable = getRecordVariable(richTextVariables, node.attrs.id);

  if (!editor.isEditable) {
    if (!variable || !variable.value) return;

    return (
      <NodeViewWrapper as="div" data-variable-id={variable.id}>
        <RichTextRenderer content={variable.value} />
      </NodeViewWrapper>
    );
  }

  const fallbackRecordVariable = recordVariable
    ? undefined
    : (getRecordVariable(variables, node.attrs.id) ??
      getRecordVariable(fileVariables, node.attrs.id));
  const fallbackVariable = variable
    ? undefined
    : (getVariable(fileVariables, node.attrs.id) ??
      getVariable(variables, node.attrs.id));

  if (!variable || !recordVariable) {
    if (!fallbackVariable || !fallbackRecordVariable)
      return (
        <NodeViewWrapper>
          <VariableBadge colorScheme="danger">
            {t("components.rich-text-editor.variables.not-found")}
          </VariableBadge>
        </NodeViewWrapper>
      );

    return (
      <NodeViewWrapper>
        <Tooltip.Root>
          <VariableBadge colorScheme="warning">
            <Tooltip.Trigger>
              {createVariableNameString(
                fallbackRecordVariable,
                fallbackVariable,
              )}
            </Tooltip.Trigger>
            <Tooltip.Content align="center">
              {t("components.rich-text-editor.variable-invalid-type.tooltip", {
                variableName: createVariableNameString(
                  fallbackRecordVariable,
                  fallbackVariable,
                ),
                variableType: t(
                  `common.variableNames.${fallbackVariable.type}`,
                ),
              })}
            </Tooltip.Content>
          </VariableBadge>
        </Tooltip.Root>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper>
      <Tooltip.Root>
        <div
          className="border border-gray5 p-2 rounded bg-white focus:outer-focus my-1"
          data-focus={selected}
          data-drag-handle
        >
          <Row className="gap-2 items-center">
            <VariableTypeIcon
              type={variable.type}
              className="inline self-center"
            />
            <Tooltip.Trigger>{variable.name}</Tooltip.Trigger>
          </Row>
          <Tooltip.Content align="center">
            {createVariableNameString(recordVariable, variable)}
          </Tooltip.Content>
        </div>
      </Tooltip.Root>
    </NodeViewWrapper>
  );
}

export const RichTextVariableExtensions = ({
  richTextVariables,
  ...props
}: Required<VariableExtensionsParams>) =>
  HeadlessRichTextVariableExtensions({ richTextVariables }).extend({
    allowGapCursor: true,
    addNodeView(this) {
      return ReactNodeViewRenderer((nodeRendererProps) => (
        <RichTextVariable
          richTextVariables={richTextVariables}
          {...props}
          {...nodeRendererProps}
        />
      ));
    },
  });
