import { Label as SystemLabel } from "@mioto/design-system/Label";
import { Stack } from "@mioto/design-system/Stack";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import {
  EditorContent,
  type EditorContentProps,
  useEditor,
} from "@tiptap/react";
import React, { type JSX } from "react";
import type { XmlFragment } from "yjs";
import { richInputExtensions } from "../../Editors/RichInput/richInputExtensions";
import { editorClasses } from "../../utils/styles";
import "./RichInput.css";
import { useTranslations } from "@mioto/locale";
import { useEditorVariables } from "../../../editor/useEditorVariables";
import type {
  IMultiSelectVariable,
  PrimitiveVariable,
} from "../../../variables/exports/types";

export type RichInputProps = {
  yContent: XmlFragment;
  Label?:
    | ((props: {
        onClick: () => void;
        className?: string;
        id: string;
      }) => JSX.Element)
    | string;
  min?: number;
  max?: number;
  onValidation?: (valid: "too_short" | "too_long" | "valid") => void;
} & Omit<EditorContentProps, "editor" | "content" | "onUpdate" | "ref">;

export const RichInput = ({
  yContent,
  className,
  Label,
  min,
  max,
  onValidation,
  placeholder,
  ...props
}: RichInputProps) => {
  const t = useTranslations();
  const variables = useEditorVariables({
    filterPrimitives: (
      variable,
    ): variable is Exclude<PrimitiveVariable, IMultiSelectVariable> =>
      variable.type === "number" ||
      variable.type === "text" ||
      variable.type === "email" ||
      variable.type === "select" ||
      variable.type === "date",
  });

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: twMerge(`${editorClasses} overflow-y-hidden`),
      },
    },
    extensions: richInputExtensions({ variables, placeholder, t }, yContent),
  });

  const isFocused = editor?.isFocused;
  const text = editor?.getText();

  React.useEffect(() => {
    if (!onValidation || !text || isFocused) return;

    if (min && text.length < min) {
      return onValidation("too_short");
    }

    if (max && text.length > max) {
      return onValidation("too_long");
    }

    return onValidation("valid");
  }, [text, max, min, onValidation, isFocused]);
  const id = React.useId();

  return editor != null ? (
    <Stack>
      {typeof Label === "string" ? (
        <SystemLabel
          id={id}
          className="mb-2"
          onClick={() =>
            editor?.commands.focus("end", { scrollIntoView: true })
          }
        >
          {Label}
        </SystemLabel>
      ) : (
        Label?.({
          className: "mb-2",
          id,
          onClick: () =>
            editor?.commands.focus("end", { scrollIntoView: true }),
        })
      )}
      <Stack
        className="bg-gray1 border border-gray6 rounded overflow-x-auto focus-within:inner-focus h-[39px] rich-input"
        style={{ scrollbarWidth: "none" }}
        data-focus={editor?.isFocused}
      >
        <EditorContent
          role="textbox"
          aria-labelledby={id}
          className={twMerge(
            `h-full p-2 px-3 w-max min-w-full noKey ${className}`,
          )}
          editor={editor}
          {...props}
        />
      </Stack>
    </Stack>
  ) : null;
};
