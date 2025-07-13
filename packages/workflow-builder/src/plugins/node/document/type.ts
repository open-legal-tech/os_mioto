import { z } from "zod";
import {
  ZNodePlugin,
  type ZNodePluginParams,
} from "../../../tree/type/plugin/NodePlugin";
import { DocumentNode } from "./plugin";

export const ZDocumentNode = (treeClient: ZNodePluginParams) =>
  ZNodePlugin(DocumentNode.type)(treeClient).extend({
    templateUuid: z.string().optional(),
  });
