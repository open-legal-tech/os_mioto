import { XmlFragment } from "yjs";
import { z } from "zod";

export type { JSONContent as TRichText } from "@tiptap/react";

export const ZRichText = z.instanceof(XmlFragment);

export const acceptedVariableTypes = [
  "boolean",
  "multi-select",
  "number",
  "select",
  "text",
  "date",
];
