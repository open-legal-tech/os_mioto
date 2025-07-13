import { z } from "zod";
import {
  ZNodePlugin,
  type ZNodePluginParams,
} from "../../../tree/type/plugin/NodePlugin";
import { DocumentNode } from "./plugin";

export const ZDocumentNodeV2 = (treeClient: ZNodePluginParams) =>
  ZNodePlugin(DocumentNode.type)(treeClient).extend({
    templateUuid: z.string().optional(),
    documentName: z.string(),
    outputAs: z.enum(["pdf", "docx"]).optional(),
  });
