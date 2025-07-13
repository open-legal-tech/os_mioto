import type { JSONContent } from "@tiptap/core";
import { ref } from "valtio/vanilla";
import {
  prosemirrorJSONToYXmlFragment,
  yXmlFragmentToProsemirrorJSON,
} from "y-prosemirror";
import { XmlFragment } from "yjs";
import { richDateEditorSchema } from "../../../Editors/RichDate/headlessDateExtensions";

export function createYRichTextFragment(
  currentContent?: JSONContent,
  xmlFragment?: XmlFragment,
) {
  if (!currentContent) {
    return new XmlFragment();
  }

  return prosemirrorJSONToYXmlFragment(
    richDateEditorSchema,
    currentContent,
    xmlFragment,
  );
}

export type TYRichText = XmlFragment;

export function convertToRichTextJson(yContent: XmlFragment) {
  return yXmlFragmentToProsemirrorJSON(yContent);
}

export const createUnproxiedYRichTextFragment = (
  currentContent?: JSONContent,
) => {
  return ref(createYRichTextFragment(currentContent));
};
