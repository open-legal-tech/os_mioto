import Document from "@tiptap/extension-document";
import { Plugin, PluginKey } from "@tiptap/pm/state";

const calculationRegex = /^[0-9+\-*/()^.@ ]+$/;
const constrainInput = new PluginKey("constrainInput");

const constrainInputPlugin = new Plugin({
  key: constrainInput,
  props: {
    handleDOMEvents: {
      beforeinput: (view, event) => {
        const activeMention = (view.state as any)?.mention$?.active;
        if (activeMention) return false;

        if (!event.inputType.startsWith("insert") || !event.data) return false;

        for (let i = 0; i < event.data.length; i++) {
          if (!event.data[i]?.match(calculationRegex)) {
            event.preventDefault();
            return true;
          }
        }

        return false;
      },
    },
  },
});

export const OneLinerMath = Document.extend({
  content: "block",
  addProseMirrorPlugins() {
    return [constrainInputPlugin];
  },
});
