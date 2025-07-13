import { type TranslationFn } from "@mioto/locale";
import { createUnproxiedYRichTextFragment } from "../../../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type { TNodeId } from "../../../../../../tree/id";
import type { TTreeClient } from "../../../../../../tree/type/treeClient";
import { FormNode } from "../../../exports/plugin";
import { InputPlugin, type TInputId } from "../../InputPlugin";
import { updateRequired } from "../../utils/inputMethods/index";
import { updateLabel } from "../../utils/inputMethods/updateLabel";
import { updateNoRendererLabel } from "../../utils/inputMethods/updateNoRendererLabel";
import { FileInputTypeName, type IFileInput } from "./type";

export class FileInputPlugin extends InputPlugin<IFileInput> {
  constructor() {
    super(FileInputTypeName);
  }

  create = ({
    required = true,
    label,
    t,
    ...data
  }: Partial<Omit<IFileInput, "id" | "type">> & { t: TranslationFn }) => {
    return {
      id: `input_${crypto.randomUUID()}`,
      type: this.type,
      required,
      label: label ? label : t("plugins.node.form.file.name"),
      yRendererLabel: createUnproxiedYRichTextFragment() as any,
      accept: ["docx", "pdf"],
      ...data,
    } satisfies IFileInput;
  };

  updateRequired = updateRequired;

  toggleAccept =
    (
      nodeId: TNodeId,
      inputId: TInputId,
      type: NonNullable<IFileInput["accept"]>[number],
    ) =>
    (treeClient: TTreeClient) => {
      const input = FormNode.inputs.getType(
        nodeId,
        inputId,
        "file",
      )(treeClient);

      input.accept?.includes(type)
        ? input.accept?.splice(input.accept.indexOf(type), 1)
        : input.accept?.push(type);
    };

  updateLabel = updateLabel;

  updateNoRendererLabel = updateNoRendererLabel;
}

export const FileInput = new FileInputPlugin();
