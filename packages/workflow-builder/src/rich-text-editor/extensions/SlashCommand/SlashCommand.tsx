import type { TranslationFn } from "@mioto/locale";
import { type Editor, Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, {
  type SuggestionProps,
  type SuggestionKeyDownProps,
} from "@tiptap/suggestion";
import tippy from "tippy.js";
import type { VariableExtensionsParams } from "../../types/VariablePlugins";
import { MenuList, type MenuListProps } from "./MenuList";
import { filterGroups } from "./groups";

const extensionName = "slashCommand";

let popup: any;

export const SlashCommand = (
  params: VariableExtensionsParams & {
    groups: Parameters<typeof filterGroups>[0];
    t: TranslationFn;
  },
) => {
  const groups = filterGroups(params.groups)(params.t);
  return Extension.create({
    name: extensionName,

    priority: 200,

    onCreate() {
      popup = tippy("body", {
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
        theme: "slash-command",
        offset: [16, 8],
        popperOptions: {
          strategy: "fixed",
          modifiers: [
            {
              name: "flip",
              enabled: false,
            },
          ],
        },
      });
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          char: "/",
          pluginKey: new PluginKey(extensionName),
          allow: () => true,
          command: ({ editor, props }: { editor: Editor; props: any }) => {
            const { view, state } = editor;
            const { $head, $from } = view.state.selection;

            const end = $from.pos;
            const from = $head?.nodeBefore
              ? end -
                ($head.nodeBefore.text?.substring(
                  $head.nodeBefore.text?.indexOf("/"),
                ).length ?? 0)
              : $from.start();

            const tr = state.tr.deleteRange(from, end);
            view.dispatch(tr);

            props.action(editor);
            view.focus();
          },
          items: () => groups,
          render: () => {
            let component: any;

            let scrollHandler: (() => void) | null = null;

            return {
              onStart: ({ command, ...props }: SuggestionProps) => {
                component = new ReactRenderer(MenuList, {
                  props: {
                    onAction: command,
                    ...params,
                    ...props,
                    groups,
                  } satisfies MenuListProps,
                  editor: props.editor,
                });

                const { view } = props.editor;

                const getReferenceClientRect = () => {
                  if (!props.clientRect) {
                    return props.editor.storage[extensionName].rect;
                  }

                  const rect = props.clientRect();

                  if (!rect) {
                    return props.editor.storage[extensionName].rect;
                  }

                  let yPos = rect.y;

                  if (
                    rect.top + component.element.offsetHeight + 40 >
                    window.innerHeight
                  ) {
                    const diff =
                      rect.top +
                      component.element.offsetHeight -
                      window.innerHeight +
                      40;
                    yPos = rect.y - diff;
                  }

                  return new DOMRect(rect.x, yPos, rect.width, rect.height);
                };

                scrollHandler = () => {
                  popup?.[0].setProps({
                    getReferenceClientRect,
                  });
                };

                view.dom.parentElement?.addEventListener(
                  "scroll",
                  scrollHandler,
                );

                popup?.[0].setProps({
                  getReferenceClientRect,
                  appendTo: () => document.body,
                  content: component.element,
                });

                popup?.[0].show();
              },

              onUpdate(props: SuggestionProps) {
                component.updateProps(props);

                const { view } = props.editor;

                const getReferenceClientRect = () => {
                  if (!props.clientRect) {
                    return props.editor.storage[extensionName].rect;
                  }

                  const rect = props.clientRect();

                  if (!rect) {
                    return props.editor.storage[extensionName].rect;
                  }

                  // Account for when the editor is bound inside a container that doesn't go all the way to the edge of the screen
                  return new DOMRect(rect.x, rect.y, rect.width, rect.height);
                };

                const scrollHandler = () => {
                  popup?.[0].setProps({
                    getReferenceClientRect,
                  });
                };

                view.dom.parentElement?.addEventListener(
                  "scroll",
                  scrollHandler,
                );

                // eslint-disable-next-line no-param-reassign
                props.editor.storage[extensionName].rect = props.clientRect
                  ? getReferenceClientRect()
                  : {
                      width: 0,
                      height: 0,
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                    };
                popup?.[0].setProps({
                  getReferenceClientRect,
                });
              },

              onKeyDown(props: SuggestionKeyDownProps) {
                if (props.event.key === "Escape") {
                  popup?.[0].hide();

                  return true;
                }

                if (!popup?.[0].state.isShown) {
                  popup?.[0].show();
                }

                return component.ref?.onKeyDown(props);
              },

              onExit(props) {
                if (props.decorationNode) {
                  props.editor.commands.setTextSelection({
                    from:
                      props.editor.state.selection.from -
                      (props.query.length + 1),
                    to: props.editor.state.selection.to,
                  });

                  props.editor.commands.deleteSelection();
                }

                popup?.[0].hide();
                if (scrollHandler) {
                  const { view } = props.editor;
                  view.dom.parentElement?.removeEventListener(
                    "scroll",
                    scrollHandler,
                  );
                }
                component.destroy();
              },
            };
          },
        }),
      ];
    },

    addStorage() {
      return {
        rect: {
          width: 0,
          height: 0,
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        },
      };
    },
  });
};

export default SlashCommand;
