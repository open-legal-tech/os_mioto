import type { z } from "zod";
import { createUnproxiedYRichTextFragment } from "../../../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import { InputPlugin } from "../../InputPlugin";
import { updateRequired } from "../../utils/inputMethods/index";
import { updateLabel } from "../../utils/inputMethods/updateLabel";
import { updateNoRendererLabel } from "../../utils/inputMethods/updateNoRendererLabel";
import { DateTypeName, type ZDateInput } from "./type";
import type { TranslationFn } from "@mioto/locale";

export type IDateInput = z.infer<typeof ZDateInput>;

export class DateInputPlugin extends InputPlugin<IDateInput> {
  constructor() {
    super(DateTypeName);
  }

  create = ({
    required = true,
    label,
    t,
    ...data
  }: Partial<Omit<IDateInput, "id" | "type">> & { t: TranslationFn }) => {
    return {
      id: `input_${crypto.randomUUID()}`,
      type: this.type,
      required,
      label: label ? label : t("plugins.node.form.date.label-default"),
      yRendererLabel: createUnproxiedYRichTextFragment() as any,
      ...data,
    } satisfies IDateInput;
  };

  updateRequired = updateRequired;

  updateLabel = updateLabel;

  updateNoRendererLabel = updateNoRendererLabel;
}

export const DateInput = new DateInputPlugin();
