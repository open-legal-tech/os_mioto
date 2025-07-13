import type { z } from "zod";
import { createUnproxiedYRichTextFragment } from "../../../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type { TNodeId } from "../../../../../../tree/id";
import type { TTreeClient } from "../../../../../../tree/type/treeClient";
import { FormNode } from "../../../exports/plugin";
import { InputPlugin, type TInputId } from "../../InputPlugin";
import { updateRequired } from "../../utils/inputMethods/index";
import { updateLabel } from "../../utils/inputMethods/updateLabel";
import { updateNoRendererLabel } from "../../utils/inputMethods/updateNoRendererLabel";
import { updatePlaceholder } from "../../utils/inputMethods/updatePlaceholder";
import { NumberInputTypeName, type ZNumberInput } from "./type";
import type { TranslationFn } from "@mioto/locale";

export type INumberInput = z.infer<typeof ZNumberInput>;

export class NumberInputPlugin extends InputPlugin<INumberInput> {
  constructor() {
    super(NumberInputTypeName);
  }

  create = ({
    required = true,
    label,
    t,
    ...data
  }: Partial<Omit<INumberInput, "id" | "type">> & { t: TranslationFn }) => {
    return {
      id: `input_${crypto.randomUUID()}`,
      type: this.type,
      required,
      label: label ? label : t("plugins.node.form.number.label-default"),
      min: 0,
      yRendererLabel: createUnproxiedYRichTextFragment() as any,
      ...data,
    } satisfies INumberInput;
  };

  updateRequired = updateRequired;

  updateMax =
    (nodeId: TNodeId, inputId: TInputId, newValue?: number) =>
    (treeClient: TTreeClient) => {
      const input = FormNode.inputs.getType(
        nodeId,
        inputId,
        "number",
      )(treeClient);
      input.max = newValue;
    };

  updateMin =
    (nodeId: TNodeId, inputId: TInputId, newValue?: number) =>
    (treeClient: TTreeClient) => {
      const input = FormNode.inputs.getType(
        nodeId,
        inputId,
        "number",
      )(treeClient);
      input.min = newValue;
    };

  updatePlaceholder = updatePlaceholder;

  updateRound =
    (nodeId: TNodeId, inputId: TInputId, roundTo: number) =>
    (treeClient: TTreeClient) => {
      const input = FormNode.inputs.getType(
        nodeId,
        inputId,
        "number",
      )(treeClient);

      input.roundTo = roundTo;
    };

  disableRound =
    (nodeId: TNodeId, inputId: TInputId) => (treeClient: TTreeClient) => {
      const input = FormNode.inputs.getType(
        nodeId,
        inputId,
        "number",
      )(treeClient);

      input.roundTo = undefined;
    };

  updateLabel = updateLabel;

  updateNoRendererLabel = updateNoRendererLabel;
}

export const NumberInput = new NumberInputPlugin();
