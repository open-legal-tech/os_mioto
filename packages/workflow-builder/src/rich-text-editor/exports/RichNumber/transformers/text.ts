import type { JSONContent } from "@tiptap/core";
import { generateText } from "@tiptap/core";
import type { TNodeId } from "../../../../tree/id";
import type {
  INumberVariable,
  IRecordVariable,
} from "../../../../variables/exports/types";
import { headlessRichNumberExtensions } from "../../../Editors/RichNumberEditor/headlessNumberExtensions";
import { fromHtml } from "./html";

export const getText = ({
  json,
  variables,
  locale,
  html,
}: {
  variables: Record<TNodeId, IRecordVariable<INumberVariable>>;
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
    headlessRichNumberExtensions({ variables, locale }),
  );
};
