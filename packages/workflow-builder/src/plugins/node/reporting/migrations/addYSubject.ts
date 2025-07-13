import { ref } from "valtio/vanilla";
import { createYRichTextFragment } from "../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type { pluginMigrationFn } from "../../../../tree/type/migrations/createPluginMigration";
import type { IReportingNode } from "../plugin";

export const addYSubject: pluginMigrationFn<IReportingNode> =
  () => async (node) => {
    node.ySubject = ref(
      createYRichTextFragment({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: node.mailSubject }],
          },
        ],
      }),
    );
  };
