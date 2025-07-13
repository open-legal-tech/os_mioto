import type { TranslationFn } from "@mioto/locale";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import Collaboration from "@tiptap/extension-collaboration";
import Placeholder from "@tiptap/extension-placeholder";
import type { XmlFragment } from "yjs";
import type { TNodeId } from "../../../tree/id";
import type {
  IFileVariable,
  IRecordVariable,
  IRichTextVariable,
  PrimitiveVariable,
} from "../../../variables/exports/types";
// import { FilePreviewExtension } from "../../extensions/FilePreview/FilePreviewExtension";
import { ImageBlock } from "../../extensions/ImageBlock/ImageBlock";
import { ImageUpload } from "../../extensions/ImageUpload/ImageUpload";
import { RichTextVariableExtensions } from "../../extensions/RichTextVariable/extension";
import { SlashCommand } from "../../extensions/SlashCommand";
import { FileVariableExtension } from "../../extensions/Variable/FileVariableExtension";
import { VariableExtension } from "../../extensions/Variable/VariableExtension";
import { sharedRichTextEditorExtensions } from "./headlessRichTextExtensions";

export const richTextExtensions = (
  params: {
    variables: Record<TNodeId, IRecordVariable<PrimitiveVariable>>;
    fileVariables: Record<TNodeId, IRecordVariable<IFileVariable>>;
    richTextVariables: Record<TNodeId, IRecordVariable<IRichTextVariable>>;
    onFileUpload: (file: File) => Promise<string>;
    t: TranslationFn;
    placeholder?: string;
  },
  fragment?: XmlFragment,
) => {
  return [
    ...sharedRichTextEditorExtensions(params.onFileUpload),
    Placeholder.configure({
      placeholder:
        params.placeholder ??
        params.t("components.rich-text-editor.placeholder"),
    }),
    ImageBlock.configure({
      HTMLAttributes: {
        loading: "lazy",
        class: "rounded my-2",
      },
    }),
    ImageUpload,
    BubbleMenu.configure({ element: document.getElementById("mark-menu") }),
    SlashCommand({
      ...params,
      groups: {
        "section:format": "all",
        "section:blocks": "all",
        "section:variables": "all",
      },
    }),
    VariableExtension(params),
    FileVariableExtension(params),
    // FilePreviewExtension(params),
    RichTextVariableExtensions(params),
    ...(fragment ? [Collaboration.configure({ fragment })] : []),
  ];
};
