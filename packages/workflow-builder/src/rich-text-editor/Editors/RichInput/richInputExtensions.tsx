import type { TranslationFn } from "@mioto/locale";
import { getSchema } from "@tiptap/core";
import Collaboration from "@tiptap/extension-collaboration";
import Placeholder from "@tiptap/extension-placeholder";
import type { XmlFragment } from "yjs";
import type { TNodeId } from "../../../tree/id";
import type {
  IRecordVariable,
  PrimitiveVariable,
} from "../../../variables/exports/types";
import { SlashCommand } from "../../extensions/SlashCommand";
import { VariableExtension } from "../../extensions/Variable/VariableExtension";
import { sharedRichInputExtensions } from "./headlessRichInputExtensions";

export type RichInputExtensionParams = {
  variables: Record<TNodeId, IRecordVariable<PrimitiveVariable>>;
  placeholder?: string;
  t: TranslationFn;
};

export const richInputExtensions = (
  params: RichInputExtensionParams,
  fragment?: XmlFragment,
) => {
  const variableExtensionParams = {
    ...params,
    fileVariables: {},
    richTextVariables: {},
  };

  return [
    ...sharedRichInputExtensions(params.placeholder),
    Placeholder.configure({
      placeholder: params.t("components.rich-text-editor.placeholder"),
    }),
    SlashCommand({
      ...variableExtensionParams,
      groups: { "section:variables": ["item:variable"] },
    }),
    VariableExtension(variableExtensionParams),
    ...(fragment ? [Collaboration.configure({ fragment })] : []),
  ];
};

export const createRichInputSchema = () =>
  getSchema(
    richInputExtensions({
      variables: {},
      // We only need the schema. This translation function does not
      // actually matter.
      t: {} as any,
    }),
  );
