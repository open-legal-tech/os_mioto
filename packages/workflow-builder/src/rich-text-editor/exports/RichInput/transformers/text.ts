import type { JSONContent } from "@tiptap/core";
import { generateText } from "@tiptap/core";
import type { TNodeId } from "../../../../tree/id";
import type {
  IRecordVariable,
  PrimitiveVariable,
} from "../../../../variables/exports/types";
import { headlessRichInputExtensions } from "../../../Editors/RichInput/headlessRichInputExtensions";
import { fromHtml } from "./html";

export const getText = ({
  json,
  html,
  variables,
  locale,
}: {
  variables: Record<TNodeId, IRecordVariable<PrimitiveVariable>>;
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

  return generateText(data, headlessRichInputExtensions({ variables, locale }));
};
