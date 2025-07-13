import { mergeAttributes } from "@tiptap/core";
import { Node } from "@tiptap/core";
import type { IRichTextVariable } from "../../../variables/exports/types";
import type { VariableExtensionsParams } from "../../types/VariablePlugins";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    "rich-text": {
      /**
       * Toggle a paragraph
       */
      setRichText: (variable: IRichTextVariable) => ReturnType;
    };
  }
}

export const HeadlessRichTextVariableExtensions = ({
  richTextVariables: _,
}: Pick<VariableExtensionsParams, "richTextVariables">) =>
  Node.create({
    group: "block",
    name: "rich-text",
    inline: false,
    draggable: true,
    parseHTML: () => {
      return [{ tag: "rich-text" }];
    },
    renderHTML({ HTMLAttributes, node }) {
      return [
        "rich-text",
        mergeAttributes(this.options?.HTMLAttributes, HTMLAttributes),
        "empty",
      ];
    },
    addAttributes() {
      return {
        id: {
          default: null,
          parseHTML: (element) => element.getAttribute("data-variable-id"),
        },
      };
    },
    addCommands() {
      return {
        setRichText:
          (variable) =>
          ({ commands }) => {
            return commands.insertContent([
              {
                type: this.name,
                attrs: { id: variable.id },
              },
              { type: "paragraph" },
            ]);
          },
      };
    },
  });
