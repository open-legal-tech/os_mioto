import type { z } from "zod";
import { createUnproxiedYRichTextFragment } from "../../../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import { InputPlugin } from "../../InputPlugin";
import { updateRequired } from "../../utils/inputMethods/index";
import { updateLabel } from "../../utils/inputMethods/updateLabel";
import { updateNoRendererLabel } from "../../utils/inputMethods/updateNoRendererLabel";
import { updatePlaceholder } from "../../utils/inputMethods/updatePlaceholder";
import { TextTypeName, type ZTextInput } from "./type";
import type { TranslationFn } from "@mioto/locale";

export type ITextInput = z.infer<typeof ZTextInput>;

export class TextInputPlugin extends InputPlugin<ITextInput> {
  constructor() {
    super(TextTypeName);
  }

  create = ({
    required = true,
    label,
    t,
    ...data
  }: Partial<Omit<ITextInput, "id" | "type">> & { t: TranslationFn }) => {
    return {
      id: `input_${crypto.randomUUID()}`,
      type: this.type,
      required,
      label: label ? label : t("plugins.node.form.text.label-default"),
      yRendererLabel: createUnproxiedYRichTextFragment() as any,
      ...data,
    } satisfies ITextInput;
  };

  updateRequired = updateRequired;

  updatePlaceholder = updatePlaceholder;

  updateLabel = updateLabel;

  updateNoRendererLabel = updateNoRendererLabel;
}

export const TextInput = new TextInputPlugin();
