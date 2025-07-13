import type { JSONContent } from "@tiptap/core";
import { generateHTML, generateJSON } from "@tiptap/html";
import type { TNodeId } from "../../../../tree/id";
import type {
  IRecordVariable,
  PrimitiveVariable,
} from "../../../../variables/exports/types";
import { headlessRichInputExtensions } from "../../../Editors/RichInput/headlessRichInputExtensions";

type HTMLParams = {
  variables: Record<TNodeId, IRecordVariable<PrimitiveVariable>>;
  locale: string;
};

export function generateHtml({
  json,
  locale,
  variables = {},
}: { json: JSONContent } & HTMLParams) {
  return generateHTML(
    json,
    headlessRichInputExtensions({
      variables,
      locale,
    }),
  );
}

export function fromHtml({
  html,
  locale,
  variables = {},
}: {
  html: string;
} & HTMLParams) {
  return generateJSON(
    html,
    headlessRichInputExtensions({
      variables,
      locale,
    }),
  );
}
