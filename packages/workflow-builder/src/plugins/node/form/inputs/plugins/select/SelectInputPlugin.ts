import type { z } from "zod";
import { createUnproxiedYRichTextFragment } from "../../../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import { InputPlugin, type createFn } from "../../InputPlugin";
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
import { SelectInputTypeName, type ZSelectInput } from "./type";

export type ISelectInput = z.infer<typeof ZSelectInput>;

export class SelectInputPlugin extends InputPlugin<ISelectInput> {
  constructor() {
    super(SelectInputTypeName);
  }

  create: createFn<ISelectInput> = ({
    answers = [createAnswer({})],
    required = true,
    label,
    t,
    ...data
  }) => {
    return {
      id: `input_${crypto.randomUUID()}`,
      type: this.type,
      answers,
      required,
      label: label ? label : t("plugins.node.form.select.label-default"),
      yRendererLabel: createUnproxiedYRichTextFragment() as any,
      ...data,
    } satisfies ISelectInput;
  };

  createAnswer = createAnswer;

  getAnswer = getAnswer;

  addAnswer = addAnswer;

  updateAnswer = updateAnswer;

  reorderAnswers = reorderAnswers;

  deleteAnswer = deleteAnswer;

  getInputsWithAnswers = getInputsWithAnswers;

  updateRequired = updateRequired;

  updateLabel = updateLabel;

  updateNoRendererLabel = updateNoRendererLabel;
}

export const SelectInput = new SelectInputPlugin();
