import type { MentionOptions } from "@tiptap/extension-mention";
import type { DecorationWithType, Editor } from "@tiptap/react";
import type { Node as ProseMirrorNode } from "prosemirror-model";

export type ReactNodeViewRendererProps = {
  options: MentionOptions;
  editor: Editor;
  node: ProseMirrorNode;
  getPos: (() => number) | boolean;
  HTMLAttributes: Record<string, any>;
  decorations: DecorationWithType[];
  extension: Node;
  selected?: boolean;
};
