"use client";

import {
  EditorContent,
  type EditorContentProps,
  type JSONContent,
  useEditor,
} from "@tiptap/react";
import { richTextRendererExtensions } from "../../Editors/RichTextEditor/richTextRendererExtensions";
import { editorClasses } from "../../utils/styles";
import "../../Editors/RichTextEditor/Details.css";
import { useLocale } from "@mioto/locale";
import type { XmlFragment } from "yjs";
import { useEditorVariables } from "../../../editor/useEditorVariables";
import { useRendererMethods } from "../../../renderer/Context";
import type {
  IFileVariable,
  IRichTextVariable,
  PrimitiveVariable,
} from "../../../variables/exports/types";

type Props = {
  className?: string;
  fragment?: XmlFragment;
  content?: JSONContent;
} & Omit<EditorContentProps, "editor" | "ref" | "content">;

export function RichTextRenderer({ fragment, content, ...props }: Props) {
  const {getVariables} = useRendererMethods()
  const variables = getVariables({
    filterPrimitives: (variable): variable is PrimitiveVariable =>
      variable.type === "number" ||
      variable.type === "text" ||
      variable.type === "email" ||
      variable.type === "select" ||
      variable.type === "date"
  });

  const fileVariables = getVariables({
    filterPrimitives: (variable): variable is IFileVariable =>
      variable.type === "file",
  });

  const richTextVariables = getVariables({
    filterPrimitives: (variable): variable is IRichTextVariable =>
      variable.type === "rich-text",
  });

  const locale = useLocale();
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: editorClasses,
      },
    },
    extensions: richTextRendererExtensions(
      {
        fileVariables,
        variables,
        richTextVariables,
        locale,
      },
      fragment,
    ),
    editable: false,
    content,
  });

  return (
    <EditorContent data-test="richTextEditor" editor={editor} {...props} />
  );
}
