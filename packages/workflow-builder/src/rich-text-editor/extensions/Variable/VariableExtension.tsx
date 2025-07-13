import { textClasses } from "@mioto/design-system/Text/classes";
import { Tooltip } from "@mioto/design-system/Tooltip";
import { useLocale, useTranslations } from "@mioto/locale";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { fromUnixTime } from "date-fns";
import { useDateFormatter } from "react-aria";
import { VariableTypeIcon } from "../../../editor/components/NodeTypeIcon";
import { getRecordVariable } from "../../../variables/utils/getRecordVariable";
import { getVariable } from "../../../variables/utils/getVariable";
import { VariableBadge } from "../../components/VariableBadge";
import type { VariableExtensionsParams } from "../../types/VariablePlugins";
import { createVariableNameString } from "../../utils/createVariableNameString";
import { HeadlessVariableExtension } from "./HeadlessVariableExtension";

function VariableNodeView({
  richTextVariables = {},
  fileVariables = {},
  variables = {},
  editor,
  ...props
}: NodeViewProps & VariableExtensionsParams) {
  const locale = useLocale();
  const t = useTranslations();
  const dateFormatter = useDateFormatter();

  const recordVariable = getRecordVariable(variables, props.node.attrs.id);
  const variable = getVariable(variables, props.node.attrs.id);

  if (!editor.isEditable) {
    if (!variable) return;

    if (variable.type === "date") {
      if (!variable.value) return;

      return (
        <NodeViewWrapper as="span">
          {dateFormatter.format(fromUnixTime(variable.value))}
        </NodeViewWrapper>
      );
    }

    if (variable.type === "number") {
      if (!variable.value == null) return;

      if (variable.value === "NaN")
        return (
          <NodeViewWrapper as="span" data-variable-id={variable.id}>
            <span className="text-danger8">
              {t("components.rich-text-editor.variables.invalid")}
            </span>
          </NodeViewWrapper>
        );

      return (
        <NodeViewWrapper as="span">
          {Number(variable.value).toLocaleString(locale, {
            maximumFractionDigits: 20,
          })}
        </NodeViewWrapper>
      );
    }

    return (
      <NodeViewWrapper
        as="span"
        data-variable-id={variable.id}
        className={textClasses({
          size: "inherit",
          className: "paragraph variable",
        })}
      >
        {variable.readableValue}
      </NodeViewWrapper>
    );
  }

  const fallbackRecordVariable = recordVariable
    ? undefined
    : (getRecordVariable(richTextVariables, props.node.attrs.id) ??
      getRecordVariable(fileVariables, props.node.attrs.id));
  const fallbackVariable = variable
    ? undefined
    : (getVariable(fileVariables, props.node.attrs.id) ??
      getVariable(richTextVariables, props.node.attrs.id));

  if (!variable || !recordVariable) {
    if (!fallbackVariable || !fallbackRecordVariable)
      return (
        <VariableBadge colorScheme="danger">
          {t("components.rich-text-editor.variables.not-found")}
        </VariableBadge>
      );

    return (
      <Tooltip.Root>
        <VariableBadge colorScheme="warning">
          <Tooltip.Trigger asChild>
            <span>
              {createVariableNameString(
                fallbackRecordVariable,
                fallbackVariable,
              )}
            </span>
          </Tooltip.Trigger>
          <Tooltip.Content align="center">
            {t("components.rich-text-editor.variable-invalid-type.tooltip", {
              variableName: createVariableNameString(
                fallbackRecordVariable,
                fallbackVariable,
              ),
              variableType: t(`common.variableNames.${fallbackVariable.type}`),
            })}
          </Tooltip.Content>
        </VariableBadge>
      </Tooltip.Root>
    );
  }

  return variable.main ? (
    <Tooltip.Root>
      <VariableBadge>
        <VariableTypeIcon type={variable.type} />
        <Tooltip.Trigger asChild>
          <span>{createVariableNameString(recordVariable, variable)}</span>
        </Tooltip.Trigger>
        <Tooltip.Content align="center">
          {recordVariable.name}: {variable.name}
        </Tooltip.Content>
      </VariableBadge>
    </Tooltip.Root>
  ) : (
    <VariableBadge>
      <VariableTypeIcon type={variable.type} />
      <span>{createVariableNameString(recordVariable, variable)}</span>
    </VariableBadge>
  );
}

export const VariableExtension = ({
  fileVariables,
  richTextVariables,
  variables,
}: VariableExtensionsParams) => {
  const locale = useLocale();

  return HeadlessVariableExtension({
    variables: variables ?? {},
    locale,
    name: "mention",
  }).extend({
    addNodeView(this) {
      return ReactNodeViewRenderer((props) => {
        return (
          <VariableNodeView
            fileVariables={fileVariables}
            richTextVariables={richTextVariables}
            variables={variables}
            {...props}
          />
        );
      });
    },
  });
};
