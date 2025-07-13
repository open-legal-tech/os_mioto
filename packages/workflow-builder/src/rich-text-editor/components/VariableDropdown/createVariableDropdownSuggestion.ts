import { PluginKey } from "@tiptap/pm/state";
import { ReactRenderer } from "@tiptap/react";
import type { SuggestionOptions } from "@tiptap/suggestion";
import { matchSorter } from "match-sorter";
import { flat } from "remeda";
import tippy, { type Instance } from "tippy.js";
import type { IRecordVariable } from "../../../variables/exports/types";
import {
  VariableDropdown,
  type VariableDropdownProps,
  type VariableDropdownRef,
} from "./VariableDropdown";

/**
 * We filter out empty variables and record variables with no values.
 */
const filterRelevantVariables = (variables: Record<string, IRecordVariable>) =>
  Object.values(variables).filter((variable) => {
    // If a record variable has no children, we do not want to show it
    if (Object.keys(variable.value).length === 0) return false;

    return true;
  });

export type VariableItems = ReturnType<typeof filterRelevantVariables>;

export const createVariableDropdownSuggestion = ({
  char = "@",
  pluginKey,
  variables,
  labelledBy,
}: {
  pluginKey: string;
  char: string;
  variables: Record<string, IRecordVariable>;
  labelledBy?: string;
}): Omit<SuggestionOptions<FlatArray<VariableItems, 1>>, "editor"> => {
  const variableItems = filterRelevantVariables(variables);

  return {
    pluginKey: new PluginKey(pluginKey),
    char,
    items: ({ query }) => {
      return matchSorter(flat(variableItems), query, {
        keys: [
          (item) => [
            item.name,
            ...Object.values(item.value ?? []).map((value) => value.name),
          ],
        ],
      });
    },
    allowSpaces: true,
    render: () => {
      let component: ReactRenderer<VariableDropdownRef, VariableDropdownProps>;

      let popup: Instance<any>[];

      return {
        onStart(props) {
          component = new ReactRenderer(VariableDropdown, {
            props: {
              close: () => {
                return popup[0]?.hide();
              },
              onKeyDown: this.onKeyDown,
              labelledBy,
              ...props,
            },
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect as () => DOMRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
            hideOnClick: "toggle",
            role: "menu",
            zIndex: 40,
          });
        },

        onUpdate(props) {
          component.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup[0]?.setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props) {
          if (props.event.key === "Escape") {
            popup[0]?.hide();

            return true;
          }

          return component.ref?.onKeyDown(props) ?? true;
        },

        onExit(props) {
          // If the mention indicator is empty we want to remove it so it
          // does not directly open the mention popup again
          if (props.decorationNode) {
            props.editor.commands.setTextSelection({
              from:
                props.editor.state.selection.from - (props.query.length + 1),
              to: props.editor.state.selection.to,
            });

            props.editor.commands.deleteSelection();
          }

          popup[0]?.destroy();
          component.destroy();
        },
      };
    },
  };
};
