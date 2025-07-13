import { type Editor, NodeViewWrapper } from "@tiptap/react";
import { useCallback } from "react";
import { ImageUploader } from "./ImageUploader";

export const ImageUpload = ({
  getPos,
  editor,
  selected,
}: {
  getPos: () => number;
  editor: Editor;
  selected: boolean;
}) => {
  const onUpload = useCallback(
    (url: string) => {
      if (url) {
        editor
          .chain()
          .setImageBlock({ src: url })
          .deleteRange({ from: getPos(), to: getPos() })
          .focus()
          .run();
      }
    },
    [getPos, editor],
  );

  if (!editor.isEditable) return null;

  return (
    <NodeViewWrapper>
      <div
        className="p-0 m-0 my-1 rounded focus:outer-focus"
        data-focus={selected}
        data-drag-handle
      >
        <ImageUploader onUpload={onUpload} />
      </div>
    </NodeViewWrapper>
  );
};

export default ImageUpload;
