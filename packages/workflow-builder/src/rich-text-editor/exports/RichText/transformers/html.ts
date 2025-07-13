import type { JSONContent } from "@tiptap/core";
import { generateHTML, generateJSON } from "@tiptap/html";
import type { TNodeId } from "../../../../tree/id";
import type {
  IFileVariable,
  IRecordVariable,
  PrimitiveVariable,
} from "../../../../variables/exports/types";
import { headlessRichTextEditorExtensions } from "../../../Editors/RichTextEditor/headlessRichTextExtensions";

type HTMLParams = {
  variables: Record<TNodeId, IRecordVariable<PrimitiveVariable>>;
  fileVariables?: Record<TNodeId, IRecordVariable<IFileVariable>>;
  locale: string;
};

export function generateHtml({
  json,
  fileVariables = {},
  variables = {},
  locale,
}: { json: JSONContent } & HTMLParams) {
  return generateHTML(
    json,
    headlessRichTextEditorExtensions({
      fileVariables,
      variables,
      locale,
    }),
  );
}

export function fromHtml({
  fileVariables = {},
  html,
  variables = {},
  locale,
}: {
  html: string;
} & HTMLParams) {
  return generateJSON(
    html,
    headlessRichTextEditorExtensions({
      fileVariables,
      variables,
      locale,
    }),
  );
}
