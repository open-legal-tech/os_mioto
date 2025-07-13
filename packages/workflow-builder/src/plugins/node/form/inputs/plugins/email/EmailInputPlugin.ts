import type { z } from "zod";
import { createUnproxiedYRichTextFragment } from "../../../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import { InputPlugin } from "../../InputPlugin";
import { updateRequired } from "../../utils/inputMethods/index";
import { updateLabel } from "../../utils/inputMethods/updateLabel";
import { updateNoRendererLabel } from "../../utils/inputMethods/updateNoRendererLabel";
import { updatePlaceholder } from "../../utils/inputMethods/updatePlaceholder";
import { EmailTypeName, type ZEmailInput } from "./type";
import type { TranslationFn } from "@mioto/locale";

export type IEmailInput = z.infer<typeof ZEmailInput>;

export class EmailInputPlugin extends InputPlugin<IEmailInput> {
  constructor() {
    super(EmailTypeName);
  }

  create = ({
    required = true,
    label,
    t,
    ...data
  }: Partial<Omit<IEmailInput, "id" | "type">> & { t: TranslationFn }) => {
    return {
      id: `input_${crypto.randomUUID()}`,
      type: this.type,
      required,
      label: label ? label : t("plugins.node.form.email.label-default"),
      yRendererLabel: createUnproxiedYRichTextFragment() as any,
      ...data,
    } satisfies IEmailInput;
  };

  updateRequired = updateRequired;

  updatePlaceholder = updatePlaceholder;

  updateLabel = updateLabel;

  updateNoRendererLabel = updateNoRendererLabel;
}

export const EmailInput = new EmailInputPlugin();
