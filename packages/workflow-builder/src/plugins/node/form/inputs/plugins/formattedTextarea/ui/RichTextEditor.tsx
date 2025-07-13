import { badgeClasses } from "@mioto/design-system/Badge";
import Label from "@mioto/design-system/Label";
import { Message } from "@mioto/design-system/Message";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import Collaboration from "@tiptap/extension-collaboration";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import type { FieldError } from "react-hook-form";
import type { XmlFragment } from "yjs";
import { baseRichTextEditorExtensions } from "../../../../../../../rich-text-editor/Editors/RichTextEditor/headlessRichTextExtensions";
import { editorClasses } from "../../../../../../../rich-text-editor/utils/styles";

export function RichTextEditor({
  value,
  onChange,
  fragment,
  required,
  error,
  label,
  placeholder,
  withOptionalLabel = false,
}: {
  required?: boolean;
  error?: FieldError;
  label?: string;
  placeholder?: string;
  withOptionalLabel?: boolean;
} & (
  | {
      value: string;
      onChange: (value?: JSONContent) => void;
      fragment?: never;
    }
  | { fragment: XmlFragment; value?: never; onChange?: never }
)) {
  const t = useTranslations();

  const editor = useEditor(
    {
      editorProps: {
        attributes: {
          class: `${editorClasses} p-2 text-mediumText`,
        },
      },
      content: value,
      onUpdate: onChange
        ? ({ editor }) => {
            const text = editor.getText();

            if (text.length === 0 && value) {
              onChange(undefined);
            }

            if (text.length > 0) {
              onChange(editor.getJSON());
            }
          }
        : undefined,
      extensions: [
        ...baseRichTextEditorExtensions,
        Placeholder.configure({ placeholder }),
        ...(fragment ? [Collaboration.configure({ fragment })] : []),
      ],
    },
    [placeholder],
  );

  return (
    <Stack className="gap-2">
      {label ? (
        <Label
          onClick={() =>
            editor?.commands.focus("end", { scrollIntoView: true })
          }
        >
          {label}
          {!required && withOptionalLabel ? (
            <span className={badgeClasses({ colorScheme: "gray" })}>
              {t("components.inputs.optional-badge")}
            </span>
          ) : null}
        </Label>
      ) : null}
      <div className="bg-gray1 border border-gray6 rounded-md focus-within:inner-focus overflow-y-auto grid min-h-[200px] max-h-[600px]">
        <EditorContent editor={editor} className="h-full noKey" />
      </div>
      {error ? <Message colorScheme="danger">{error.message}</Message> : null}
    </Stack>
  );
}
