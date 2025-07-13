import { badgeClasses } from "@mioto/design-system/Badge";
import { useLocale } from "@mioto/locale";
import { NodeViewWrapper } from "@tiptap/react";
import { fromUnixTime } from "date-fns";
import type { Node as ProseMirrorNode } from "prosemirror-model";

export const DateNodeView = ({ node }: { node: ProseMirrorNode }) => {
  const locale = useLocale();
  return (
    <NodeViewWrapper
      as="span"
      className={badgeClasses({
        colorScheme: "info",
        className: "max-w-max inline-flex rounded",
      })}
    >
      {fromUnixTime(node.attrs.date).toLocaleDateString(locale, {
        dateStyle: "medium",
      })}
    </NodeViewWrapper>
  );
};
