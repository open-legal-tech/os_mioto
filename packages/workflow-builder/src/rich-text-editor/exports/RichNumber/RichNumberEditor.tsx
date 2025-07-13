import { useTranslations } from "@mioto/locale";
import { type EditorContentProps, useEditor } from "@tiptap/react";
import type { XmlFragment } from "yjs";
import { useEditorVariables } from "../../../editor/useEditorVariables";
import type { INumberVariable } from "../../../variables/dataTypes/NumberVariable";
import { BaseEditor, type BaseEditorProps } from "../../Editors/BaseEditor";
import { richNumberExtensions } from "../../Editors/RichNumberEditor/richNumberExtensions";
import { editorClasses } from "../../utils/styles";

export type RichNumberEditorProps = {
  yContent: XmlFragment;
} & Omit<EditorContentProps, "editor" | "content" | "onUpdate" | "ref"> &
  Omit<BaseEditorProps, "editor">;

export function RichNumberEditor({
  yContent,
  placeholder,
  ...props
}: RichNumberEditorProps) {
  const t = useTranslations();
  const variables = useEditorVariables({
    filterPrimitives: (variable): variable is INumberVariable =>
      variable.type === "number",
  });

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: editorClasses,
      },
    },
    extensions: richNumberExtensions({ variables, t, placeholder }, yContent),
  });

  return <BaseEditor editor={editor} {...props} />;
}
