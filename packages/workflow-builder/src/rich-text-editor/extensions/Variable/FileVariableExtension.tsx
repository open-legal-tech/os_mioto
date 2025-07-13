import Link from "@mioto/design-system/Link";
import { Tooltip } from "@mioto/design-system/Tooltip";
import { useLocale, useTranslations } from "@mioto/locale";
import { FileText } from "@phosphor-icons/react/dist/ssr";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { VariableTypeIcon } from "../../../editor/components/NodeTypeIcon";
import type { IFileVariable } from "../../../variables/exports/types";
import { getRecordVariable } from "../../../variables/utils/getRecordVariable";
import { getVariable } from "../../../variables/utils/getVariable";
import { VariableBadge } from "../../components/VariableBadge";
import type { VariableExtensionsParams } from "../../types/VariablePlugins";
import { HeadlessVariableExtension } from "./HeadlessVariableExtension";

const FileDownloadLink = ({ variable }: { variable: IFileVariable }) => {
  const t = useTranslations();

  return (
    <NodeViewWrapper>
      <Link
        ghost
        href={`/api/getFile/${variable.value?.uuid}`}
        download
        className="inline-flex items-baseline underline gap-1 link"
        data-variable-id={variable.id}
      >
        <FileText className="inline self-center" />
        {variable.name}
      </Link>
    </NodeViewWrapper>
  );
};

function FileVariable({
  editor,
  fileVariables = {},
  node,
  variables = {},
  richTextVariables = {},
}: NodeViewProps & VariableExtensionsParams) {
  const t = useTranslations();
  const recordVariable = getRecordVariable(fileVariables, node.attrs.id);
  const variable = getVariable(fileVariables, node.attrs.id);

  const fallbackVariable = variable
    ? undefined
    : (getVariable(variables, node.attrs.id) ??
      getVariable(richTextVariables, node.attrs.id));

  if (!editor.isEditable) {
    if (!variable) return;

    return (
      <NodeViewWrapper>
        <FileDownloadLink variable={variable} />
      </NodeViewWrapper>
    );
  }

  if (!variable || !recordVariable) {
    if (!fallbackVariable)
      return (
        <VariableBadge colorScheme="danger">
          {t("components.rich-text-editor.variables.not-found")}
        </VariableBadge>
      );

    return (
      <Tooltip.Root>
        <VariableBadge colorScheme="warning">
          <Tooltip.Trigger asChild>
            <span>{fallbackVariable.name}</span>
          </Tooltip.Trigger>
          <Tooltip.Content align="center">
            {t("components.rich-text-editor.variable-invalid-type.tooltip", {
              variableName: fallbackVariable.name,
              variableType: t(`common.variableNames.${fallbackVariable.type}`),
            })}
          </Tooltip.Content>
        </VariableBadge>
      </Tooltip.Root>
    );
  }

  return (
    <Tooltip.Root>
      <VariableBadge>
        <VariableTypeIcon type={variable.type} />
        <Tooltip.Trigger asChild>
          <span>{variable.name}</span>
        </Tooltip.Trigger>
        <Tooltip.Content align="center">
          {recordVariable.name} / {variable.name}
        </Tooltip.Content>
      </VariableBadge>
    </Tooltip.Root>
  );
}

export const FileVariableExtension = ({
  fileVariables,
  richTextVariables,
  variables,
}: VariableExtensionsParams) => {
  const locale = useLocale();

  return HeadlessVariableExtension({
    variables: fileVariables ?? {},
    locale,
    name: "fileMention",
  }).extend({
    addNodeView(this) {
      return ReactNodeViewRenderer((props) => (
        <FileVariable
          fileVariables={fileVariables}
          richTextVariables={richTextVariables}
          variables={variables}
          {...props}
        />
      ));
    },
  });
};
