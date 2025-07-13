import Document from "@tiptap/extension-document";
import { Plugin, PluginKey } from "@tiptap/pm/state";

const constrainInput = new PluginKey("constrainInput");

const constrainInputPlugin = new Plugin({
  key: constrainInput,
  props: {
    handleDOMEvents: {
      beforeinput: (view, event) => {
        const activeMention = (view.state as any)?.mention$?.active;
        if (activeMention) return false;

        if (!event.inputType.startsWith("insert") || !event.data) return false;

        return true;
      },
    },
  },
});

export const OneLiner = Document.extend({
  content: "block",
  addProseMirrorPlugins() {
    return [constrainInputPlugin];
  },
});
