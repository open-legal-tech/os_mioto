import type { JSONContent } from "@tiptap/core";
import { generateText } from "@tiptap/core";
import type { TNodeId } from "../../../../tree/id";
import type {
  INumberVariable,
  IRecordVariable,
} from "../../../../variables/exports/types";
import { headlessRichDateExtensions } from "../../../Editors/RichDate/headlessDateExtensions";

export const getText = ({
  json,
  variables,
  locale,
}: {
  json: JSONContent;
  variables: Record<TNodeId, IRecordVariable<INumberVariable>>;
  locale: string | "unformatted";
}) => {
  return generateText(json, headlessRichDateExtensions({ variables, locale }));
};
