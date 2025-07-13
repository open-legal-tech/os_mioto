import type { JSONContent } from "@tiptap/core";
import { generateHTML, generateJSON } from "@tiptap/html";
import type { TNodeId } from "../../../../tree/id";
import type {
  INumberVariable,
  IRecordVariable,
} from "../../../../variables/exports/types";
import { headlessRichDateExtensions } from "../../../Editors/RichDate/headlessDateExtensions";

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
    headlessRichDateExtensions({
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
    headlessRichDateExtensions({
      variables,
      locale,
    }),
  );
}
