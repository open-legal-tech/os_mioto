import { z } from "zod";
import { ZRichText } from "../../../../../rich-text-editor/exports/types";
import { ZInputId } from "../../../../../tree/id";
import { ZEntityPluginBase } from "../../../../../tree/type/plugin/EntityPlugin";
import { ZGlobalVariableId } from "../../../global-variables/type";

export const ZInputPlugin = <TType extends string>(type: TType) =>
  ZEntityPluginBase(z.literal(type)).extend({
    id: ZInputId,
    label: z.string(),
    yRendererLabel: ZRichText,
    noRendererLabel: z.boolean().optional(),
    globalVariableReferences: ZGlobalVariableId.optional(),
  });
