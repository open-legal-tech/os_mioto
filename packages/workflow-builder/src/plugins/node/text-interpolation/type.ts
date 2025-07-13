import { z } from "zod";
import { ZRichText } from "../../../rich-text-editor/exports/types";
import {
  ZNodePlugin,
  type ZNodePluginParams,
} from "../../../tree/type/plugin/NodePlugin";
import { TextInterpolationNode } from "./plugin";

export const ZTextInterpolationNode = (treeClient: ZNodePluginParams) =>
  ZNodePlugin(TextInterpolationNode.type)(treeClient).extend({
    yContent: ZRichText,
    isFormatted: z.boolean().optional(),
  });
