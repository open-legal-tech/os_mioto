import { z } from "zod";
import { ZRichText } from "../../../rich-text-editor/exports/types";
import { ZChildId, ZMainChildId } from "../../../tree/id";
import { ZNodePlugin } from "../../../tree/type/plugin/NodePlugin";
import type { TTreeClient } from "../../../tree/type/treeClient";
import { typeName } from "./plugin";

export const ZReportingNode = (treeClient: TTreeClient) => {
  return ZNodePlugin(typeName)(treeClient).extend({
    mailSubject: z.string(),
    yMailBody: ZRichText,
    ySubject: ZRichText,
    attachements: z.array(z.union([ZMainChildId, ZChildId])),
    sendUserAnswers: z.boolean(),
    variant: z.union([
      z.object({
        type: z.literal("default"),
      }),
      z.object({
        type: z.literal("variable"),
        recipientVariable: z.union([ZMainChildId, ZChildId]).optional(),
      }),
      z.object({
        type: z.literal("custom"),
        recipientCustom: z.string().optional(),
      }),
    ]),
  });
};
