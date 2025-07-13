import { Label as SystemLabel } from "@mioto/design-system/Label";
import { Stack } from "@mioto/design-system/Stack";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import { type Editor, EditorContent } from "@tiptap/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { type JSX } from "react";

export type BaseEditorProps = {
  Label?:
    | ((props: { onClick: () => void; id: string }) => JSX.Element)
    | string;
  editor: Editor | null;
  maxHeight?: number;
  minHeight?: number;
  className?: string;
};

export function BaseEditor({
  Label,
  editor,
  minHeight = 40,
  maxHeight,
  className,
}: BaseEditorProps) {
  const id = React.useId();

  return (
    <Stack>
      {typeof Label === "string" ? (
        <SystemLabel
          id={id}
          className="mb-2"
          onClick={() =>
            editor?.commands.focus("end", { scrollIntoView: true })
          }
        >
          {Label}
        </SystemLabel>
      ) : (
        Label?.({
          id,
          onClick: () =>
            editor?.commands.focus("end", { scrollIntoView: true }),
        })
      )}
      <div
        className="grid overflow-hidden"
        style={{
          gridTemplateRows: `minmax(${minHeight}px, ${
            maxHeight ? `${maxHeight}px` : "1fr"
          })`,
        }}
      >
        <Stack
          className="bg-gray1 border border-gray6 rounded overflow-y-scroll focus-within:inner-focus"
          style={{
            maxHeight: `${maxHeight}px`,
            minHeight: `${minHeight}px`,
          }}
          data-focus={editor?.isFocused}
        >
          <AnimatePresence>
            {editor && (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.1, ease: "easeIn" },
                }}
                className="h-full"
                data-focus={editor?.isFocused}
              >
                <EditorContent
                  role="textbox"
                  aria-labelledby={id}
                  className={twMerge(
                    `h-full p-2 noKey overflow-x-hidden ${className}`,
                  )}
                  editor={editor}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Stack>
      </div>
    </Stack>
  );
}
