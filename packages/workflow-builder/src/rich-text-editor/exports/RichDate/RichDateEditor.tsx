import { useTranslations } from "@mioto/locale";
import { type EditorContentProps, useEditor } from "@tiptap/react";
import type { XmlFragment } from "yjs";
import { useEditorVariables } from "../../../editor/useEditorVariables";
import type { INumberVariable } from "../../../variables/exports/types";
import { BaseEditor, type BaseEditorProps } from "../../Editors/BaseEditor";
import { richDateExtensions } from "../../Editors/RichDate/richDateExtensions";
import { editorClasses } from "../../utils/styles";

export type RichDateEditorProps = {
  yContent: XmlFragment;
} & Omit<EditorContentProps, "editor" | "content" | "onUpdate" | "ref"> &
  Omit<BaseEditorProps, "editor">;

export function RichDateEditor({
  yContent,
  placeholder,
  ...props
}: RichDateEditorProps) {
  const t = useTranslations();
  const variables = useEditorVariables({
    filterPrimitives: (variable): variable is INumberVariable =>
      variable.type === "number" || variable.type === "date",
  });

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: editorClasses,
      },
    },
    extensions: richDateExtensions({ variables, t, placeholder }, yContent),
  });

  return <BaseEditor editor={editor} {...props} />;
}
