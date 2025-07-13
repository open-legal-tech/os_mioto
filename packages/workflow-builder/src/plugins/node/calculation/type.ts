import { z } from "zod";
import { ZRichText } from "../../../rich-text-editor/exports/types";
import {
  ZNodePlugin,
  type ZNodePluginParams,
} from "../../../tree/type/plugin/NodePlugin";
import { calculationNodeType } from "./plugin";

export const ZCalculationNode = (treeClient: ZNodePluginParams) => {
  const baseType = ZNodePlugin(calculationNodeType)(treeClient);
  return baseType.extend({
    yFormular: ZRichText.optional(),
    roundTo: z.number().optional(),
    calculationType: z.enum(["number", "date", "date-difference"]),
    yDateFormular: ZRichText.optional(),
    yLaterDateFormular: ZRichText.optional(),
    yEarlierDateFormular: ZRichText.optional(),
    differenceIn: z
      .enum(["days", "business-days", "weeks", "months", "years"])
      .optional(),
  });
};
