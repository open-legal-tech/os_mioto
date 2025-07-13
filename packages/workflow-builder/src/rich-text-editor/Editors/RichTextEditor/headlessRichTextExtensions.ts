import { headingClasses } from "@mioto/design-system/Heading/classes";
import { linkClasses } from "@mioto/design-system/Link/classes";
import { textClasses } from "@mioto/design-system/Text/classes";
import { Details } from "@tiptap-pro/extension-details";
import { DetailsContent } from "@tiptap-pro/extension-details-content";
import { DetailsSummary } from "@tiptap-pro/extension-details-summary";
import { FileHandler } from "@tiptap-pro/extension-file-handler";
import { getSchema } from "@tiptap/core";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import type { TNodeId } from "../../../tree/id";
import type {
  IFileVariable,
  IRecordVariable,
  PrimitiveVariable,
} from "../../../variables/exports/types";
import { HeadlessImageBlock } from "../../extensions/ImageBlock/HeadlessImageBlock";
import { HeadlessImageUpload } from "../../extensions/ImageUpload/HeadlessImageUpload";
import { HeadlessVariableExtension } from "../../extensions/Variable/HeadlessVariableExtension";

export const baseRichTextEditorExtensions = [
  Document,
  Heading.configure({
    HTMLAttributes: {
      class: headingClasses({
        size: "medium",
        className:
          "[overflow-wrap:anywhere] hyphens-auto md:hyphens-none mt-3 first:mt-0 heading",
      }),
    },
  }),
  Paragraph.configure({
    HTMLAttributes: {
      class: textClasses({
        size: "inherit",
        className: `hyphens-auto md:hyphens-none mt-1 first:mt-0 [overflow-wrap:anywhere] paragraph`,
      }),
    },
  }),
  Text,
  OrderedList.configure({
    HTMLAttributes: {
      class: `list-decimal pl-6 hyphens-auto [overflow-wrap:anywhere] mt-1 first:mt-0 ordered-list`,
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: `list-disc pl-5 hyphens-auto [overflow-wrap:anywhere] mt-1 first:mt-0 unordered-list`,
    },
  }),
  ListItem.configure({
    HTMLAttributes: {
      class:
        "list-item [&_p]:list-inside [&_p]:inline mt-1 first:mt-0 hyphens-auto list-item",
    },
  }),
  Bold.configure({
    HTMLAttributes: {
      class: "font-strong",
    },
  }),
  Italic,
  Underline,
];

export const sharedRichTextEditorExtensions = (
  onFileUpload?: (file: File) => Promise<string>,
) => [
  ...baseRichTextEditorExtensions,
  HardBreak,
  Dropcursor,
  Gapcursor,
  Blockquote.configure({
    HTMLAttributes: {
      class: "border-l-2 border-gray6 mx-2 pl-2",
    },
  }),
  Link.extend({
    exitable: true,
    inclusive: false,
  }).configure({
    openOnClick: false,
    linkOnPaste: true,
    HTMLAttributes: {
      class: linkClasses({ className: "break-all text-info8", size: "large" }),
    },
  }),
  Details.configure({
    HTMLAttributes: {
      class: "details",
    },
  }),
  DetailsSummary.configure({
    HTMLAttributes: {
      class: textClasses({
        size: "large",
        className:
          "hyphens-auto md:hyphens-none mt-1 first:mt-0 [overflow-wrap:anywhere]",
      }),
    },
  }),
  DetailsContent.configure({
    HTMLAttributes: {
      class: textClasses({
        size: "large",
        className:
          "hyphens-auto md:hyphens-none mt-1 first:mt-0 [overflow-wrap:anywhere]",
      }),
    },
  }),
  FileHandler.configure({
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    onDrop: (currentEditor, files, pos) => {
      const file = files[0];

      if (!file) return;

      if (!onFileUpload) {
        throw new Error(
          "You accepted a file drop, but onFileUpload function was not provided to this editor instance.",
        );
      }
      files.forEach(async () => {
        const url = await onFileUpload(file);

        currentEditor
          .chain()
          .setImageBlockAt({ pos, src: url, alt: "" })
          .focus()
          .run();
      });
    },
    onPaste: (currentEditor, files) => {
      const file = files[0];

      if (!file) return;

      if (!onFileUpload) {
        throw new Error(
          "You accepted a file paste, but onFileUpload function was not provided to this editor instance.",
        );
      }
      files.forEach(async () => {
        const url = await onFileUpload(file);

        currentEditor
          .chain()
          .setImageBlock({ src: url, alt: "" })
          .focus()
          .run();
      });
    },
  }),
];

type Params = {
  variables: Record<TNodeId, IRecordVariable<PrimitiveVariable>>;
  fileVariables: Record<TNodeId, IRecordVariable<IFileVariable>>;
  onFileUpload?: (file: File) => Promise<string>;
  locale: string;
};

export const headlessRichTextEditorExtensions = (params: Params) => [
  ...sharedRichTextEditorExtensions(params.onFileUpload),
  HeadlessImageBlock,
  HeadlessImageUpload,
  HeadlessVariableExtension(params),
  HeadlessVariableExtension({ ...params, name: "fileMention" }),
];

export const richTextEditorSchema = () =>
  getSchema(
    headlessRichTextEditorExtensions({
      fileVariables: {},
      variables: {},
      onFileUpload: async () => "",
      locale: "",
    }),
  );
