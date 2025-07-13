import {
  type Middleware,
  autoUpdate,
  detectOverflow,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import { rowClasses } from "@mioto/design-system/Row";
import { type Editor, isNodeSelection, posToDOMRect } from "@tiptap/core";
import { type ReactNode, useLayoutEffect } from "react";

type Props = {
  editor: Editor;
  open: boolean;
  children: ReactNode;
  className?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

const overflowMiddleware = (
  containerRef: React.RefObject<HTMLDivElement | null>,
): Middleware => ({
  name: "overflowMiddleware",
  async fn(state) {
    const overflow = await detectOverflow(state, {
      boundary: containerRef.current ?? undefined,
    });

    if (overflow.bottom > 0) {
      return { y: state.y - overflow.bottom - 5 };
    }

    return {};
  },
});

// Adapted from https://github.com/ueberdosis/tiptap/issues/2305#issuecomment-1020665146
export const ControlledBubbleMenu = ({
  editor,
  open,
  children,
  className,
  containerRef,
}: Props) => {
  const {
    strategy,
    x,
    y,
    refs: { setFloating, setReference },
  } = useFloating({
    strategy: "absolute",
    whileElementsMounted: autoUpdate,
    open,
    placement: "bottom",
    middleware: [offset(10), flip(), shift(), overflowMiddleware(containerRef)],
  });

  useLayoutEffect(() => {
    const { ranges } = editor.state.selection;
    const from = Math.min(...ranges.map((range) => range.$from.pos));
    const to = Math.max(...ranges.map((range) => range.$to.pos));

    setReference({
      getBoundingClientRect() {
        if (isNodeSelection(editor.state.selection)) {
          const node = editor.view.nodeDOM(from) as HTMLElement;

          if (node) {
            return node.getBoundingClientRect();
          }
        }

        return posToDOMRect(editor.view, from, to);
      },
    });
  }, [setReference, editor.state.selection, editor.view]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={setFloating}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
      }}
      className={rowClasses({}, [
        "border-gray6 border bg-white rounded gap-2 shadow-md p-1 items-center z-10",
        className,
      ])}
    >
      {children}
    </div>
  );
};
