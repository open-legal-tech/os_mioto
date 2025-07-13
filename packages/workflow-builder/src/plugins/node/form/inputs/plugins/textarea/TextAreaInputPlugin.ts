import type { z } from "zod";
import { createUnproxiedYRichTextFragment } from "../../../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import { InputPlugin } from "../../InputPlugin";
import { updateRequired } from "../../utils/inputMethods/index";
import { updateLabel } from "../../utils/inputMethods/updateLabel";
import { updateNoRendererLabel } from "../../utils/inputMethods/updateNoRendererLabel";
import { updatePlaceholder } from "../../utils/inputMethods/updatePlaceholder";
import { TextAreaTypeName, type ZTextAreaInput } from "./type";
import type { TranslationFn } from "@mioto/locale";

export type ITextAreaInput = z.infer<typeof ZTextAreaInput>;

export class TextAreaInputPlugin extends InputPlugin<ITextAreaInput> {
  constructor() {
    super(TextAreaTypeName);
  }

  create = ({
    required = true,
    label,
    t,
    ...data
  }: Partial<Omit<ITextAreaInput, "id" | "type">> & { t: TranslationFn }) => {
    return {
      id: `input_${crypto.randomUUID()}`,
      type: this.type,
      required,
      label: label ? label : t("plugins.node.form.textarea.label-default"),
      yRendererLabel: createUnproxiedYRichTextFragment() as any,
      ...data,
    } satisfies ITextAreaInput;
  };

  updateRequired = updateRequired;

  updatePlaceholder = updatePlaceholder;

  updateLabel = updateLabel;

  updateNoRendererLabel = updateNoRendererLabel;
}

export const TextAreaInput = new TextAreaInputPlugin();
