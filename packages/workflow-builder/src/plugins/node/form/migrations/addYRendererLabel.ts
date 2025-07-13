import { XmlFragment } from "yjs";
import { createUnproxiedYRichTextFragment } from "../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type { pluginMigrationFn } from "../../../../tree/type/migrations/createPluginMigration";
import type { IFormNode } from "../exports/plugin";

export const addYRendererLabel: pluginMigrationFn<IFormNode> =
  () => async (node) => {
    const inputs = node.inputs as unknown as string[];

    inputs.forEach((input: any) => {
      console.group(`Add yRendererLabel to node ${node.id} input ${input.id}`);
      const yRendererLabel = input.yRendererLabel;

      if (yRendererLabel instanceof XmlFragment) {
        console.log("yRendererLabel is already an XmlFragment. Skip.");
        console.groupEnd();
        return;
      }

      if (!yRendererLabel) {
        const rendererLabel = input.rendererLabel;

        input.yRendererLabel = createUnproxiedYRichTextFragment(
          rendererLabel?.length > 0
            ? {
                type: "doc",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: rendererLabel }],
                  },
                ],
              }
            : undefined,
        );
      }

      console.groupEnd();
    });
  };
