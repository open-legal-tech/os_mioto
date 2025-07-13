import type { z } from "zod";
import { createUnproxiedYRichTextFragment } from "../../../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import { InputPlugin } from "../../InputPlugin";
import {
  addAnswer,
  createAnswer,
  deleteAnswer,
  getAnswer,
  getInputsWithAnswers,
  reorderAnswers,
  updateAnswer,
} from "../../utils/answerMethods/index";
import { updateRequired } from "../../utils/inputMethods/index";
import { updateLabel } from "../../utils/inputMethods/updateLabel";
import { updateNoRendererLabel } from "../../utils/inputMethods/updateNoRendererLabel";
import { MultiSelectInputTypeName, type ZMultiSelectInput } from "./type";
import type { TranslationFn } from "@mioto/locale";

export type IMultiSelectInput = z.infer<typeof ZMultiSelectInput>;

export class MultiSelectInputPlugin extends InputPlugin<IMultiSelectInput> {
  constructor() {
    super(MultiSelectInputTypeName);
  }

  create = ({
    answers = [createAnswer({})],
    required = true,
    label,
    t,
    ...data
  }: Partial<Omit<IMultiSelectInput, "id" | "type">> & {
    t: TranslationFn;
  }) => {
    return {
      id: `input_${crypto.randomUUID()}`,
      type: this.type,
      answers,
      required,
      label: label ? label : t("plugins.node.form.multi-select.label-default"),
      yRendererLabel: createUnproxiedYRichTextFragment() as any,
      ...data,
    } satisfies IMultiSelectInput;
  };

  createAnswer = createAnswer;

  addAnswer = addAnswer;

  getAnswer = getAnswer;

  updateAnswer = updateAnswer;

  reorderAnswers = reorderAnswers;

  deleteAnswer = deleteAnswer;

  getInputsWithAnswers = getInputsWithAnswers;

  updateRequired = updateRequired;

  updateLabel = updateLabel;

  updateNoRendererLabel = updateNoRendererLabel;
}

export const MultiSelectInput = new MultiSelectInputPlugin();
