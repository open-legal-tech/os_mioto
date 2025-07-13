import { NodeViewWrapper } from "@tiptap/react";
import NextImage from "next/image";
import type { Node as ProseMirrorNode } from "prosemirror-model";

export function ImageBlockComponent({ node }: { node: ProseMirrorNode }) {
  return (
    <NodeViewWrapper>
      <NextImage src={node.attrs.src} alt={node.attrs.alt} />
    </NodeViewWrapper>
  );
}
