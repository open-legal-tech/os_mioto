import { textClasses } from "@mioto/design-system/Text/classes";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import type { TNodeId } from "../../../tree/id";
import type {
  IRecordVariable,
  PrimitiveVariable,
} from "../../../variables/exports/types";
import { HeadlessVariableExtension } from "../../extensions/Variable/HeadlessVariableExtension";
import { OneLiner } from "./constrainInputPlugin";

export const sharedRichInputExtensions = (placeholder?: string) => [
  OneLiner,
  Paragraph.configure({
    HTMLAttributes: {
      class: textClasses({ className: "break-words h-full w-full" }),
    },
  }),
  Text.configure({
    HTMlAttributes: {
      class: textClasses({ className: "break-words" }),
    },
  }),
  Placeholder.configure({
    placeholder,
  }),
  Dropcursor,
  Gapcursor,
];

type Params = {
  variables: Record<TNodeId, IRecordVariable<PrimitiveVariable>>;
  locale: string;
};

export const headlessRichInputExtensions = (params: Params) => [
  ...sharedRichInputExtensions(),
  HeadlessVariableExtension({ ...params, name: "mention" }),
];
