import { IconButton, IconButtonLink } from "@mioto/design-system/IconButton";
import { Label as SystemLabel } from "@mioto/design-system/Label";
import { Popover } from "@mioto/design-system/Popover";
import { Stack } from "@mioto/design-system/Stack";
import { Text } from "@mioto/design-system/Text";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import {
  ArrowSquareOut,
  Pen,
  TextItalic,
  TextUnderline,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { TextBolderIcon } from "@phosphor-icons/react/ssr";
import {
  BubbleMenu,
  type Editor,
  EditorContent,
  type EditorContentProps,
  useEditor,
} from "@tiptap/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { type JSX } from "react";
import type { XmlFragment } from "yjs";
import { richTextExtensions } from "../../Editors/RichTextEditor/richTextExtensions";
import { getSelectedText } from "../../utils/getSelectedText";
import { editorClasses } from "../../utils/styles";
import { LinkEditor } from "./LinkEditor";
import "../../Editors/RichTextEditor/Details.css";
import { VisuallyHidden } from "@ariakit/react/visually-hidden";
import { Form } from "@mioto/design-system/Form";
import { rowClasses } from "@mioto/design-system/Row";
import { Toolbar } from "@mioto/design-system/Toolbar";
import { useTranslations } from "@mioto/locale";
import { useEditorVariables } from "../../../editor/useEditorVariables";
import type {
  IFileVariable,
  IRichTextVariable,
  PrimitiveVariable,
} from "../../../variables/exports/types";
import { onFileUploadAction } from "../../Editors/RichTextEditor/onFileUpload.action";

export type RichTextEditorProps = {
  yContent: XmlFragment;
  Label?: ((props: { onClick: () => void }) => JSX.Element) | string;
  maxHeight?: number;
  minHeight?: number;
} & Omit<EditorContentProps, "editor" | "content" | "onUpdate" | "ref">;

export const RichTextEditor = ({
  yContent,
  Label,
  minHeight = 200,
  maxHeight,
  className,
  ...props
}: RichTextEditorProps) => {
  const t = useTranslations();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const variables = useEditorVariables({
    filterPrimitives: (variable): variable is PrimitiveVariable =>
      variable.type === "number" ||
      variable.type === "text" ||
      variable.type === "email" ||
      variable.type === "select" ||
      variable.type === "date",
  });

  const fileVariables = useEditorVariables({
    filterPrimitives: (variable): variable is IFileVariable =>
      variable.type === "file",
  });

  const richTextVariables = useEditorVariables({
    filterPrimitives: (variable): variable is IRichTextVariable =>
      variable.type === "rich-text",
  });

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: `${editorClasses} p-2`,
      },
    },
    extensions: richTextExtensions(
      {
        variables,
        fileVariables,
        richTextVariables,
        t,
        onFileUpload: async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const result = await onFileUploadAction(formData);

          if (!result.success) {
            throw new Error(result.error.debugMessage);
          }

          return result.data.url;
        },
      },
      yContent,
    ),
  });

  return (
    <Stack>
      {typeof Label === "string" ? (
        <SystemLabel
          className="mb-2"
          onClick={() =>
            editor?.commands.focus("end", { scrollIntoView: true })
          }
        >
          {Label}
        </SystemLabel>
      ) : (
        Label?.({
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
        <AnimatePresence>
          {editor && (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.1, ease: "easeIn" },
              }}
              data-focus={editor?.isFocused}
              className="bg-gray1 border border-gray6 rounded-md focus-within:inner-focus overflow-y-auto grid"
              style={{
                maxHeight: `${maxHeight}px`,
                minHeight: `${minHeight}px`,
              }}
              ref={containerRef}
            >
              <LinkMenu editor={editor} />
              <ImageMenu editor={editor} />
              <MarkMenu editor={editor} />
              <EditorContent
                className={twMerge(`h-full noKey ${className}`)}
                editor={editor}
                {...props}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Stack>
  );
};

function ImageMenu({ editor }: { editor: Editor }) {
  return (
    <BubbleMenu
      pluginKey="image"
      editor={editor}
      shouldShow={({ editor }) => editor.isActive("imageBlock")}
    >
      <VisuallyHidden>
        <SystemLabel htmlFor="alt-text">Alt Text</SystemLabel>
      </VisuallyHidden>
      <Form.Input
        placeholder="Alt Text"
        size="small"
        id="alt-text"
        className="bg-transparent border-none"
        value={editor.getAttributes("imageBlock").alt ?? ""}
        onChange={(event) =>
          editor.commands.updateAttributes("imageBlock", {
            alt: event.target.value ?? "",
          })
        }
      />
    </BubbleMenu>
  );
}

function LinkMenu({ editor }: { editor: Editor }) {
  const t = useTranslations();
  const [linkPopoverOpen, setLinkPopoverOpen] = React.useState(false);

  return (
    <BubbleMenu
      pluginKey="link"
      editor={editor}
      shouldShow={({ editor }) => editor.isActive("link")}
    >
      <Popover.Root open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
        <Popover.Content className="px-3 py-2 flex flex-col">
          <LinkEditor
            href={editor.getAttributes("link").href}
            text={
              getSelectedText(editor, {
                type: "text",
                extend: true,
                cursor: true,
              }) ?? ""
            }
            onLinkUpdate={(href, text) => {
              if (text.length === 0) return;
              const {
                state: {
                  selection: { $anchor },
                },
              } = editor;

              const [link] = $anchor.marks();
              const linkMarkType = editor.schema.marks.link;

              if (!linkMarkType || !link) return;

              const newLinkMarks = linkMarkType.create({
                ...link.attrs,
                href: href ?? link.attrs.href,
              });
              const nodeWithLink = editor.schema.text(text, [newLinkMarks]);

              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .command(({ tr }) => {
                  const slice = tr.selection.content();
                  const fragment = slice.content.replaceChild(0, nodeWithLink);

                  tr.replaceWith(tr.selection.from, tr.selection.to, fragment);

                  return true;
                })
                .selectTextblockEnd()
                .run();

              setLinkPopoverOpen(false);
            }}
          />
        </Popover.Content>
        <Text size="small" className="font-weak">
          {editor.getAttributes("link").href}
        </Text>
        {editor.getAttributes("link").href ? (
          <IconButtonLink
            size="small"
            tooltip={{
              children: t(
                "components.rich-text-editor.add-link.open-external.tooltip",
                { linkName: editor.getAttributes("link").href },
              ),
            }}
            href={editor.getAttributes("link").href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ArrowSquareOut />
          </IconButtonLink>
        ) : null}
        <Popover.Trigger asChild>
          <IconButton
            size="small"
            tooltip={{
              children: t("components.rich-text-editor.add-link.edit.tooltip"),
            }}
          >
            <Pen />
          </IconButton>
        </Popover.Trigger>
        <IconButton
          size="small"
          tooltip={{
            children: t("components.rich-text-editor.add-link.remove.tooltip"),
          }}
          onClick={() => {
            editor.chain().focus().unsetLink().run();
            setLinkPopoverOpen(false);
          }}
        >
          <X />
        </IconButton>
      </Popover.Root>
    </BubbleMenu>
  );
}

function MarkMenu({ editor }: { editor: Editor }) {
  const t = useTranslations();

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => editor.isActive("paragraph")}
      pluginKey="marks"
    >
      <Toolbar.Root
        id="mark-menu"
        className={rowClasses(
          {},
          "border border-gray5 bg-white p-1 gap-1 rounded",
        )}
      >
        <Toolbar.ToggleButton
          size="small"
          onPressedChange={() => editor?.chain().toggleBold().run()}
          pressed={editor?.isActive("bold")}
          tooltip={{
            children: t("components.rich-text-editor.bold.tooltip"),
          }}
        >
          <TextBolderIcon />
        </Toolbar.ToggleButton>
        <Toolbar.ToggleButton
          size="small"
          onPressedChange={() => editor?.chain().toggleItalic().run()}
          pressed={editor?.isActive("italic")}
          tooltip={{
            children: t("components.rich-text-editor.cursiv.tooltip"),
          }}
        >
          <TextItalic />
        </Toolbar.ToggleButton>
        <Toolbar.ToggleButton
          size="small"
          onPressedChange={() => editor?.chain().toggleUnderline().run()}
          pressed={editor?.isActive("underline")}
          tooltip={{
            children: t("components.rich-text-editor.underline.tooltip"),
          }}
        >
          <TextUnderline />
        </Toolbar.ToggleButton>
      </Toolbar.Root>
    </BubbleMenu>
  );
}
