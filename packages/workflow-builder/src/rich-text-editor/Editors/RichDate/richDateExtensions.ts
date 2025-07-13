import type { TranslationFn } from "@mioto/locale";
import Collaboration from "@tiptap/extension-collaboration";
import Placeholder from "@tiptap/extension-placeholder";
import { ReactNodeViewRenderer } from "@tiptap/react";
import type { XmlFragment } from "yjs";
import type {
  IDateVariable,
  INumberVariable,
  IRecordVariable,
} from "../../../variables/exports/types";
import { SlashCommand } from "../../extensions/SlashCommand";
import { VariableExtension } from "../../extensions/Variable/VariableExtension";
import { DateNodeView } from "./DateNodeView";
import {
  CustomDateExtension,
  sharedRichDateEditorExtensions,
} from "./headlessDateExtensions";

export const richDateExtensions = (
  {
    variables,
    t,
    placeholder,
  }: {
    variables: Record<string, IRecordVariable<INumberVariable | IDateVariable>>;
    t: TranslationFn;
    placeholder?: string;
  },
  fragment?: XmlFragment,
) => {
  const variableExtensionParams = {
    variables,
    fileVariables: {},
    richTextVariables: {},
  };

  return [
    ...sharedRichDateEditorExtensions,
    Placeholder.configure({
      placeholder: placeholder ?? t("components.rich-text-editor.placeholder"),
    }),
    CustomDateExtension.extend({
      addNodeView() {
        return ReactNodeViewRenderer(DateNodeView);
      },
    }),
    SlashCommand({
      ...variableExtensionParams,
      groups: {
        "section:symbols": "all",
        "section:variables": ["item:variable"],
      },
      t,
    }),
    VariableExtension(variableExtensionParams),
    ...(fragment
      ? [
          Collaboration.configure({
            fragment,
          }),
        ]
      : []),
  ];
};
