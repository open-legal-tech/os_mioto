import { createUnproxiedYRichTextFragment } from "../../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type { pluginMigrationFn } from "../../../../../tree/type/migrations/createPluginMigration";
import type { IAINode } from "../plugin";

export const addFormattingInstructions: pluginMigrationFn<IAINode> =
  (_) => async (node) => {
    console.log(
      `Migrating ${node.id} by adding the formattingInstructions to each prompt.`,
    );

    Object.values(node.prompts).forEach((prompt) => {
      if (prompt.type === "text" && !prompt.yFormattingInstruction) {
        prompt.yFormattingInstruction = createUnproxiedYRichTextFragment();
      }
    });
  };
