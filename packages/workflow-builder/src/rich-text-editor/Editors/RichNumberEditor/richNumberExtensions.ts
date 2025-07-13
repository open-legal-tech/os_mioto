import type { TranslationFn } from "@mioto/locale";
import Collaboration from "@tiptap/extension-collaboration";
import Placeholder from "@tiptap/extension-placeholder";
import type { XmlFragment } from "yjs";
import type {
  INumberVariable,
  IRecordVariable,
} from "../../../variables/exports/types";
import { SlashCommand } from "../../extensions/SlashCommand";
import { VariableExtension } from "../../extensions/Variable/VariableExtension";
import { sharedRichNumberEditorExtensions } from "./headlessNumberExtensions";

export const richNumberExtensions = (
  {
    variables,
    t,
    placeholder,
  }: {
    variables: Record<string, IRecordVariable<INumberVariable>>;
    t: TranslationFn;
    placeholder?: string;
  },
  fragment?: XmlFragment,
) => {
  return [
    ...sharedRichNumberEditorExtensions,
    Placeholder.configure({
      placeholder: placeholder ?? t("components.rich-text-editor.placeholder"),
    }),
    SlashCommand({
      variables,
      groups: {
        "section:symbols": "all",
        "section:variables": ["item:variable"],
      },
      t,
    }),
    VariableExtension({
      variables,
    }),
    ...(fragment
      ? [
          Collaboration.configure({
            fragment,
          }),
        ]
      : []),
  ];
};
