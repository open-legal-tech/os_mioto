import { z } from "zod";
import { ZRichText } from "../../../../rich-text-editor/exports/types";
import { ZChildId, ZEntityId, ZMainChildId } from "../../../../tree/id";
import {
  ZNodePlugin,
  type ZNodePluginParams,
} from "../../../../tree/type/plugin/NodePlugin";
import { AINode } from "./plugin";

const basePrompt = z.object({
  id: ZEntityId,
  name: z.string(),
  yDescription: ZRichText,
});

export const ZAINode = (treeClient: ZNodePluginParams) =>
  ZNodePlugin(AINode.type)(treeClient).extend({
    prompts: z.record(
      z.union([
        basePrompt.extend({
          type: z.enum(["number", "boolean"]),
        }),
        basePrompt.extend({
          type: z.literal("text"),
          yFormattingInstruction: ZRichText,
        }),
      ]),
    ),
    yMainPrompt: ZRichText,
    files: z.array(ZMainChildId.or(ZChildId)),
    model: z.enum(["gpt-3.5", "gpt-4"]),
    aiType: z.enum(["extraction", "decision"]).optional(),
  });
