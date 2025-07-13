import type { JSONContent } from "@tiptap/core";
import { generateHTML, generateJSON } from "@tiptap/html";
import type { TNodeId } from "../../../../tree/id";
import type {
  INumberVariable,
  IRecordVariable,
} from "../../../../variables/exports/types";
import { headlessRichNumberExtensions } from "../../../Editors/RichNumberEditor/headlessNumberExtensions";

type HTMLParams = {
  variables: Record<TNodeId, IRecordVariable<INumberVariable>>;
  locale: string;
};

export function generateHtml({
  json,
  variables = {},
  locale,
}: { json: JSONContent } & HTMLParams) {
  return generateHTML(
    json,
    headlessRichNumberExtensions({
      variables,
      locale,
    }),
  );
}

export function fromHtml({
  html,
  variables = {},
  locale,
}: {
  html: string;
} & HTMLParams) {
  return generateJSON(
    html,
    headlessRichNumberExtensions({
      variables,
      locale,
    }),
  );
}
