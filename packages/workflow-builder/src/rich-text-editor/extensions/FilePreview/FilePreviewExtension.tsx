"use client";

import Heading from "@mioto/design-system/Heading";
import { IconButton } from "@mioto/design-system/IconButton";
import Input from "@mioto/design-system/Input";
import Label from "@mioto/design-system/Label";
import { Row } from "@mioto/design-system/Row";
import { Switch } from "@mioto/design-system/Switch";
import { Tooltip } from "@mioto/design-system/Tooltip";
import { useTranslations } from "@mioto/locale";
import { DotsSixVertical } from "@phosphor-icons/react/dist/ssr";
import type { Editor } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import dynamic from "next/dynamic";
import type { Node } from "prosemirror-model";
import { getRecordVariable } from "../../../variables/utils/getRecordVariable";
import { getVariable } from "../../../variables/utils/getVariable";
import { VariableBadge } from "../../components/VariableBadge";
import type { VariableExtensionsParams } from "../../types/VariablePlugins";
import { HeadlessFilePreviewExtension } from "./HeadlessFilePreviewExtension";

const PDFPreview = dynamic(() => import("./PDFPreview"), { ssr: false });

function FileVariable({
  editor,
  fileVariables = {},
  node,
  variables = {},
  richTextVariables = {},
  onUpdateAttributes,
  selected,
}: {
  editor: Editor;
  node: Node;
  onUpdateAttributes: (attributes: {
    downloadButton?: boolean;
    blurFromPageOnwards?: string;
  }) => void;
  selected: boolean;
} & VariableExtensionsParams) {
  const t = useTranslations();
  // const [editorWidth, setEditorWidth] = React.useState<number>(0);
  // const resizeObserver = new ResizeObserver((entries) => {
  //   for (const entry of entries) {
  //     setEditorWidth(entry.contentRect.width);
  //   }
  // });

  // React.useEffect(() => {
  //   resizeObserver.observe(editor.view.dom);

  //   return () => resizeObserver.unobserve(editor.view.dom);
  // });

  const recordVariable = getRecordVariable(fileVariables, node.attrs.id);
  const variable = getVariable(fileVariables, node.attrs.id);

  const fallbackVariable = variable
    ? undefined
    : getVariable(variables, node.attrs.id) ??
      getVariable(richTextVariables, node.attrs.id);

  if (!editor.isEditable) {
    if (!variable) return;

    return (
      <NodeViewWrapper>
        <div className="grid">
          <PDFPreview
            width={editor.view.dom.getBoundingClientRect().width - 10}
            variable={variable}
            blurFromPageOnwards={node.attrs.blurFromPageOnwards}
            downloadButton={node.attrs.downloadButton}
          />
        </div>
      </NodeViewWrapper>
    );
  }

  if (!variable || !recordVariable) {
    if (!fallbackVariable)
      return (
        <NodeViewWrapper>
          <VariableBadge colorScheme="danger">
            Variable nicht gefunden
          </VariableBadge>
        </NodeViewWrapper>
      );

    return (
      <NodeViewWrapper>
        <Tooltip.Root>
          <VariableBadge colorScheme="warning">
            <Tooltip.Trigger asChild>
              <span>{fallbackVariable.name}</span>
            </Tooltip.Trigger>
            <Tooltip.Content align="center">
              {fallbackVariable.name} ist nur noch als{" "}
              {t(`common.variableNames.${fallbackVariable.type}`)} und, nicht
              als Datei, verfügbar. Bitte lösche diese Variable und füge sie
              erneut hinzu.
            </Tooltip.Content>
          </VariableBadge>
        </Tooltip.Root>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      className="border border-gray5 p-2 rounded bg-white focus:outer-focus"
      data-focus={selected}
    >
      <Row className="justify-between items-center">
        <Row className="items-center gap-1">
          <IconButton
            tooltip={{ children: "Verschieben" }}
            data-drag-handle
            size="small"
          >
            <DotsSixVertical weight="bold" />
          </IconButton>
          <Heading size="tiny">PDF Anzeige von {variable.name}</Heading>
        </Row>
      </Row>
      <Row className="justify-between mt-3">
        <Label>Download Button</Label>
        <Switch.Root
          size="small"
          onCheckedChange={(checked) =>
            onUpdateAttributes({
              downloadButton: checked,
            })
          }
          checked={node.attrs.downloadButton}
        >
          <Switch.Thumb size="small" />
        </Switch.Root>
      </Row>
      <Label className="justify-between mt-2 flex">
        Blur from Page onwards{" "}
        <Input
          className="border-none p-0 bg-transparent"
          inputClassNames="text-extraSmallHeading w-[100px] text-end p-0"
          placeholder="No blur"
          defaultValue={node.attrs.blurFromPageOnwards}
          onChange={(event) => {
            onUpdateAttributes({
              blurFromPageOnwards: event.target.value,
            });
          }}
        />
      </Label>
    </NodeViewWrapper>
  );
}

export const FilePreviewExtension = ({
  fileVariables,
  richTextVariables,
  variables,
}: VariableExtensionsParams) =>
  HeadlessFilePreviewExtension({ fileVariables }).extend({
    addNodeView(this) {
      return ReactNodeViewRenderer(
        (props: any) => {
          return (
            <FileVariable
              editor={this.editor}
              fileVariables={fileVariables}
              node={props.node}
              richTextVariables={richTextVariables}
              variables={variables}
              onUpdateAttributes={props.updateAttributes}
              selected={props.selected}
            />
          );
        },
        { className: !this.editor.isEditable ? "w-full block" : "" },
      );
    },
  });
