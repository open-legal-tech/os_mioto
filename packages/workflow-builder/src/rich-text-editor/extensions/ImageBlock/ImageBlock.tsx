import "./ImageBlock.css";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import NextImage from "next/image";
import type { Node as ProseMirrorNode } from "prosemirror-model";
import { HeadlessImageBlock } from "./HeadlessImageBlock";

function ImageBlockComponent({ node }: { node: ProseMirrorNode }) {
  return (
    <NodeViewWrapper>
      <NextImage
        className="rounded w-full my-1 h-auto"
        src={node.attrs.src}
        alt={node.attrs.alt ?? ""}
        sizes="100vw"
        width={1280}
        height={720}
        draggable
        data-drag-handle=""
      />
    </NodeViewWrapper>
  );
}

export const ImageBlock = HeadlessImageBlock.extend({
  addNodeView(this) {
    return ReactNodeViewRenderer(ImageBlockComponent);
  },
});
