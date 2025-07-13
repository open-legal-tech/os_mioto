import { ZRichText } from "../../../../rich-text-editor/exports/types";
import {
  ZNodePlugin,
  type ZNodePluginParams,
} from "../../../../tree/type/plugin/NodePlugin";
import { InfoNode } from "./plugin";

export const ZInfoNode = (treeClient: ZNodePluginParams) =>
  ZNodePlugin(InfoNode.type)(treeClient).extend({
    yContent: ZRichText,
  });
