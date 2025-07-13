import type { z } from "zod";
import { createUnproxiedYRichTextFragment } from "../../../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import { InputPlugin } from "../../InputPlugin";
import { updateRequired } from "../../utils/inputMethods/index";
import { updateLabel } from "../../utils/inputMethods/updateLabel";
import { updateNoRendererLabel } from "../../utils/inputMethods/updateNoRendererLabel";
import { updatePlaceholder } from "../../utils/inputMethods/updatePlaceholder";
import {
  FormattedTextAreaTypeName,
  type ZFormattedTextAreaInput,
} from "./type";
import type { TranslationFn } from "@mioto/locale";

export type IFormattedTextAreaInput = z.infer<typeof ZFormattedTextAreaInput>;

export class FormattedTextAreaInputPlugin extends InputPlugin<IFormattedTextAreaInput> {
  constructor() {
    super(FormattedTextAreaTypeName);
  }

  create = ({
    required = true,
    label,
    t,
    ...data
  }: Partial<Omit<IFormattedTextAreaInput, "id" | "type">> & {
    t: TranslationFn;
  }) => {
    return {
      id: `input_${crypto.randomUUID()}`,
      type: this.type,
      required,
      label: label ? label : t("plugins.node.form.textarea.label-default"),
      yRendererLabel: createUnproxiedYRichTextFragment(),
      ...data,
    } satisfies IFormattedTextAreaInput;
  };

  updateRequired = updateRequired;

  updatePlaceholder = updatePlaceholder;

  updateLabel = updateLabel;

  updateNoRendererLabel = updateNoRendererLabel;
}

export const FormattedTextAreaInput = new FormattedTextAreaInputPlugin();
