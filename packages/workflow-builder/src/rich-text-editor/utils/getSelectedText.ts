import type { Editor } from "@tiptap/react";
import { DOMSerializer } from "prosemirror-model";

export const getSelectedText = (
  editor: Editor,
  {
    type,
    extend,
    cursor,
  }: { type: "text" | "node"; extend?: boolean; cursor?: boolean } = {
    type: "text",
    extend: false,
    cursor: false,
  },
): string | null => {
  if (!editor) return null;

  const { state } = editor;

  const { from, to, empty } = state.selection;

  if (empty && !cursor) return null;

  if (type === "node") {
    const nodesArray: string[] = [];

    state.doc.nodesBetween(from, to, (node, _, parent) => {
      if (parent === state.doc) {
        const serializer = DOMSerializer.fromSchema(editor.schema);
        const dom = serializer.serializeNode(node);
        const tempDiv = document.createElement("div");
        tempDiv.appendChild(dom);
        nodesArray.push(tempDiv.innerHTML);
      }
    });

    return nodesArray.join("");
  }

  if (extend) {
    const currentNodeText = state.doc.nodeAt(from)?.textContent;
    if (currentNodeText) {
      return currentNodeText;
    }
  }

  return editor.state.doc.textBetween(from, to, " ");
};
