import { Node } from "@tiptap/core";
import { mergeAttributes } from "@tiptap/core";
import { getVariable } from "../../../variables/utils/getVariable";
import type { VariableExtensionsParams } from "../../types/VariablePlugins";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    filePreview: {
      setFilePreviewVariable: (options: { id: string }) => ReturnType;
    };
  }
}

export const HeadlessFilePreviewExtension = ({
  fileVariables = {},
}: Pick<VariableExtensionsParams, "fileVariables">) =>
  Node.create({
    name: "filePreview",
    draggable: true,
    inline: false,
    group: "block",
    allowGapCursor: true,
    parseHTML: () => [{ tag: "filePreview" }],
    addAttributes() {
      return {
        id: { default: null },
        downloadButton: { default: false },
        blurFromPageOnwards: { default: null },
      };
    },
    renderHTML({ HTMLAttributes, node }) {
      const variable = getVariable(fileVariables, node.attrs.id);

      return [
        "filePreview",
        mergeAttributes(this.options?.HTMLAttributes, HTMLAttributes),
        variable?.name,
      ];
    },
    addCommands() {
      return {
        setFilePreviewVariable:
          (attrs) =>
          ({ commands }) => {
            return commands.insertContent({
              type: "filePreview",
              attrs: { id: attrs.id },
            });
          },
      };
    },
    renderText: (props) => {
      const variable = getVariable(fileVariables, props.node.attrs.id);

      if (!variable) return "";

      return variable.name;
    },
  });
