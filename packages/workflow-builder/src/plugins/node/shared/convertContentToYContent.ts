import { createYRichTextFragment } from "../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type { TRichText } from "../../../rich-text-editor/exports/types";
import type { pluginMigrationFn } from "../../../tree/type/migrations/createPluginMigration";
import type { INode } from "../../../tree/type/plugin/NodePlugin";

export const convertContentToYContent =
  <TType extends INode>(
    previousKey: keyof TType,
    newKey: string,
  ): pluginMigrationFn<TType> =>
  () =>
  async (node, yNode) => {
    if (!yNode.has(newKey)) {
      console.log(
        `Converting node ${node.id} content to yContent xmlFragment.`,
      );

      const previousContent = node[previousKey];

      const yContent = createYRichTextFragment(previousContent as TRichText);

      yNode.set(newKey, yContent);
    }
  };
