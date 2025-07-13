import { textClasses } from "@mioto/design-system/Text/classes";
import { getSchema } from "@tiptap/core";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import type { TNodeId } from "../../../tree/id";
import type {
  INumberVariable,
  IRecordVariable,
} from "../../../variables/exports/types";
import { HeadlessVariableExtension } from "../../extensions/Variable/HeadlessVariableExtension";
import { OneLinerMath } from "./constrainInputPlugin";

export const sharedRichNumberEditorExtensions = [
  OneLinerMath,
  Paragraph.configure({
    HTMLAttributes: {
      class: textClasses({ size: "large" }),
    },
  }),
  Text,
];

type Params = {
  variables: Record<TNodeId, IRecordVariable<INumberVariable>>;
  locale: string;
};

export const headlessRichNumberExtensions = (params: Params) => [
  ...sharedRichNumberEditorExtensions,
  HeadlessVariableExtension(params),
];

export const richNumberEditorSchema = getSchema(
  headlessRichNumberExtensions({
    variables: {},
    locale: "en-US",
  }),
);
