import Collaboration from "@tiptap/extension-collaboration";
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
import { FileVariableExtension } from "../../extensions/Variable/FileVariableExtension";
import { VariableExtension } from "../../extensions/Variable/VariableExtension";
import { sharedRichTextEditorExtensions } from "./headlessRichTextExtensions";

export const richTextRendererExtensions = (
  params: {
    variables: Record<TNodeId, IRecordVariable<PrimitiveVariable>>;
    fileVariables: Record<TNodeId, IRecordVariable<IFileVariable>>;
    richTextVariables: Record<TNodeId, IRecordVariable<IRichTextVariable>>;
    locale: string;
  },
  fragment?: XmlFragment,
) => [
  ...sharedRichTextEditorExtensions(),
  ImageBlock.configure({
    HTMLAttributes: {
      loading: "lazy",
      class: "rounded my-2",
    },
  }),
  ImageUpload,
  VariableExtension(params),
  FileVariableExtension(params),
  // FilePreviewExtension(params),
  RichTextVariableExtensions(params),
  ...(fragment ? [Collaboration.configure({ fragment })] : []),
];
