import { Node } from "@tiptap/core";
import type { IRecordVariable } from "../../../variables/exports/types";
import { getVariable } from "../../../variables/utils/getVariable";
import { variableToString } from "../../../variables/utils/variableToString";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    mention: {
      setVariable: (options: {
        type: "mention" | "fileMention";
        id: string;
      }) => ReturnType;
    };
  }
}

export const HeadlessVariableExtension = ({
  variables,
  locale,
  name = "mention",
}: {
  name?: string;
  locale: string;
  variables: Record<string, IRecordVariable>;
}) =>
  Node.create({
    group: "inline",
    name,
    inline: true,
    addCommands() {
      return {
        setVariable:
          (attrs) =>
          ({ commands }) => {
            return commands.insertContent({
              type: attrs.type,
              attrs: { id: attrs.id },
            });
          },
      };
    },
    addAttributes() {
      return {
        id: {
          default: null,
          parseHTML: (element) => element.getAttribute("data-id"),
          renderHTML: (attributes) => {
            if (!attributes.id) {
              return {};
            }
            return {
              "data-id": attributes.id,
            };
          },
        },
      };
    },
    addKeyboardShortcuts() {
      return {
        Backspace: () =>
          this.editor.commands.command(({ tr, state }) => {
            let isMention = false;
            const { selection } = state;
            const { empty, anchor } = selection;

            if (!empty) {
              return false;
            }

            state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
              if (node.type.name === this.name) {
                isMention = true;
                tr.insertText("", pos, pos + node.nodeSize);
              }

              return false;
            });

            return isMention;
          }),
      };
    },
    renderHTML: (props) => {
      const variable = getVariable(variables, props.node.attrs.id);

      if (!variable) return ["span", {}, ""];

      return ["span", {}, variableToString(variable, locale)];
    },
    renderText: (props) => {
      const variable = getVariable(variables, props.node.attrs.id);

      if (variable?.type === "number") return "0";

      if (!variable) return "";

      return variableToString(variable, locale);
    },
  });
