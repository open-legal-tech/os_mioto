import type { JSONContent } from "@tiptap/core";
import { generateText } from "@tiptap/core";
import type { TNodeId } from "../../../../tree/id";
import type {
  IFileVariable,
  IRecordVariable,
  PrimitiveVariable,
} from "../../../../variables/exports/types";
import { headlessRichTextEditorExtensions } from "../../../Editors/RichTextEditor/headlessRichTextExtensions";
import { fromHtml } from "./html";

export const getText = ({
  json,
  variables,
  fileVariables,
  locale,
  html,
}: {
  variables: Record<TNodeId, IRecordVariable<PrimitiveVariable>>;
  fileVariables: Record<TNodeId, IRecordVariable<IFileVariable>>;
  locale: string;
} & (
  | {
      json: JSONContent;
      html?: never;
    }
  | {
      json?: never;
      html: string;
    }
)) => {
  const data = json ?? fromHtml({ html, variables, locale });

  return generateText(
    data,
    headlessRichTextEditorExtensions({ variables, fileVariables, locale }),
  );
};
