import ClosedBracket from "@mioto/icons/ClosedBracket";
import Multiplication from "@mioto/icons/Multiplication";
import OpenBracket from "@mioto/icons/OpenBracket";
import type { TranslationFn } from "@mioto/locale";
import {
  At,
  Divide,
  Download,
  FilePdf,
  Image,
  ListBullets,
  ListNumbers,
  Paragraph,
  Plus,
  Subtract,
  TextColumns,
  TextH,
  TextIndent,
  TextSuperscript,
} from "@phosphor-icons/react/dist/ssr";
import { entries, intersectionWith } from "remeda";
import type { Command, Group } from "./types";

export const createGroups = (t: TranslationFn) => {
  return {
    "section:format": {
      id: `section:format`,
      name: "Format",
      children: [
        {
          id: `item:heading1`,
          name: "Heading",
          Icon: <TextH />,
          description: "High priority section title",
          aliases: ["h1"],
          action: (editor) => {
            editor.chain().focus().setHeading({ level: 1 }).run();
          },
          shouldBeHidden(editor) {
            return (
              editor?.isActive("detailsSummary") || editor?.isActive("heading")
            );
          },
        },
        {
          id: `item:paragraph`,
          name: "Paragraph",
          Icon: <Paragraph />,
          description: "Normaler Textparagraph",
          aliases: ["p"],
          action: (editor) => {
            editor.chain().focus().setParagraph().run();
          },
          shouldBeHidden(editor) {
            return (
              editor?.isActive("detailsSummary") ||
              editor?.isActive("paragraph")
            );
          },
        },
        {
          id: `item:bullet-list`,
          name: "Bullet List",
          Icon: <ListBullets />,
          description: "Unordered list of items",
          aliases: ["ul"],
          action: (editor) => {
            editor.chain().focus().toggleBulletList().run();
          },
          shouldBeHidden(editor) {
            return (
              editor?.isActive("detailsSummary") ||
              editor?.isActive("bulletList")
            );
          },
        },
        {
          id: `item:ordered-list`,
          name: "Numbered List",
          Icon: <ListNumbers />,
          description: "Ordered list of items",
          aliases: ["ol"],
          action: (editor) => {
            editor.chain().focus().toggleOrderedList().run();
          },
          shouldBeHidden(editor) {
            return (
              editor?.isActive("detailsSummary") ||
              editor?.isActive("orderedList")
            );
          },
        },
      ],
    },
    "section:symbols": {
      id: `section:symbols`,
      name: "Symbols",
      children: [
        {
          id: `item:addition`,
          name: "Addition",
          Icon: <Plus />,
          description: t("components.rich-text-editor.addition.tooltip"),
          aliases: ["+"],
          action: (editor) => {
            editor?.chain().focus().insertContent("+ ").run();
          },
        },
        {
          id: `item:subtraction`,
          name: "Subtraction",
          Icon: <Subtract />,
          description: t("components.rich-text-editor.subtraktion.tooltip"),
          aliases: ["-"],
          action: (editor) => {
            editor?.chain().focus().insertContent("- ").run();
          },
        },
        {
          id: `item:multiplication`,
          name: "Multiplication",
          Icon: <Multiplication />,
          description: t("components.rich-text-editor.multiplikation.tooltip"),
          aliases: ["*"],
          action: (editor) => {
            editor?.chain().focus().insertContent("* ").run();
          },
        },
        {
          id: `item:division`,
          name: "Division",
          Icon: <Divide />,
          description: t("components.rich-text-editor.division.tooltip"),
          aliases: ["/"],
          action: (editor) => {
            editor?.chain().focus().insertContent("/ ").run();
          },
        },
        {
          id: `item:open-bracket`,
          name: "Open Bracket",
          Icon: <OpenBracket />,
          description: t("components.rich-text-editor.open-bracket.tooltip"),
          aliases: ["("],
          action: (editor) => {
            editor?.chain().focus().insertContent("( ").run();
          },
        },
        {
          id: `item:closed-bracket`,
          name: "Closed Bracket",
          Icon: <ClosedBracket />,
          description: t("components.rich-text-editor.close-bracket.tooltip"),
          aliases: [")"],
          action: (editor) => {
            editor?.chain().focus().insertContent(") ").run();
          },
        },
        {
          id: `item:potency`,
          name: "Potency",
          Icon: <TextSuperscript />,
          description: t("components.rich-text-editor.potenz.tooltip"),
          aliases: ["^"],
          action: (editor) => {
            editor?.chain().focus().insertContent("^ ").run();
          },
        },
      ],
    },
    "section:blocks": {
      id: "section:blocks",
      name: "Blöcke",
      children: [
        {
          id: "item:toggle",
          name: "Toggle",
          Icon: <TextIndent />,
          description: "Füge einen Toggle-Block ein.",
          aliases: ["toggle", "details"],
          action: (editor) => {
            editor?.chain().focus().setDetails().run();
          },
          shouldBeHidden(editor) {
            return editor?.isActive("detailsSummary");
          },
        },
        {
          id: "item:image",
          name: "Bild",
          Icon: <Image />,
          description: "Füge ein Bild ein.",
          aliases: ["image", "img"],
          action: (editor) => {
            editor?.chain().focus().setImageUpload().run();
          },
          shouldBeHidden(editor) {
            return (
              editor?.isActive("detailsSummary") ||
              editor?.isActive("ImageBlock")
            );
          },
        },
      ],
    },
    "section:variables": {
      id: `section:variables`,
      name: "Variablen",
      children: [
        {
          id: `item:variable`,
          name: t("components.rich-text-editor.slashCommand.addVariable.title"),
          Icon: <At />,
          description: t(
            "components.rich-text-editor.slashCommand.addVariable.description",
          ),
          aliases: ["var"],
          action: (editor) => {
            editor
              ?.chain()
              .focus()
              .insertContent([{ type: "text", text: "/@" }])
              .run();
          },
        },
        {
          id: `item:pdf-preview`,
          name: "PDF-Vorschau",
          Icon: <FilePdf />,
          description: "Füge eine PDF Vorschau ein.",
          aliases: ["var", "pdf", "preview", "file", "file:"],
          action: (editor) => {
            editor
              ?.chain()
              .focus()
              .insertContent([{ type: "text", text: "/file:preview" }])
              .run();
          },
          shouldBeHidden(editor) {
            return editor?.isActive("detailsSummary");
          },
        },
        {
          id: `item:file-link`,
          name: "Datei Downloadlink",
          Icon: <Download />,
          description: "Füge einen Datei Downloadlink ein.",
          aliases: ["var", "link", "file", "file:"],
          action: (editor) => {
            editor
              ?.chain()
              .focus()
              .insertContent([{ type: "text", text: "/file:link" }])
              .run();
          },
        },
        {
          id: `item:rich-variable`,
          name: "Formatierter Text",
          Icon: <TextColumns />,
          description: "Füge formatierten Text ein.",
          aliases: ["var", "rich"],
          action: (editor) => {
            editor
              ?.chain()
              .focus()
              .insertContent([{ type: "text", text: "/rich-text" }])
              .run();
          },
          shouldBeHidden(editor) {
            return editor?.isActive("detailsSummary");
          },
        },
      ],
    },
  } satisfies Record<string, Group>;
};

type Sections = ReturnType<typeof createGroups>;

type SectionIds = keyof Sections;

type SectionWithChildrenIds = {
  [K in SectionIds]?: Sections[K]["children"][number]["id"][] | "all";
};

export const filterGroups = (ids: SectionWithChildrenIds) => {
  return (t: TranslationFn) => {
    const groups = createGroups(t);

    return entries(ids).reduce((acc, [sectionKey, childrenKeys]) => {
      const section = groups[sectionKey];

      if (!section) return acc;

      if (childrenKeys === "all") {
        acc.push(section);
      } else {
        acc.push({
          ...section,
          children: intersectionWith<Command, string>(
            section.children,
            childrenKeys,
            (child, key) => child.id === key,
          ),
        });
      }

      return acc;
    }, [] as Group[]);
  };
};
