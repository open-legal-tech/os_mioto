"use client";

import { useTranslations } from "@mioto/locale";
import { Controller } from "react-hook-form";
import {
  useRendererContext,
  useRendererMethods,
} from "../../../../../../../renderer/Context";
import { getText } from "../../../../../../../rich-text-editor/exports/RichInput/transformers/text";
import { useTreeClient } from "../../../../../../../tree/sync/treeStore/TreeContext";
import {
  type PrimitiveVariable,
  isFileVariable,
} from "../../../../../../../variables/exports/types";
import { FormNode } from "../../../../exports/plugin";
import type { InputRenderer } from "../../../types/componentTypes";
import { RichTextEditor } from "./RichTextEditor";

export const FormattedTextAreaInputRenderer: InputRenderer = ({
  inputId,
  nodeId,
  required,
}) => {
  const t = useTranslations();
  const { treeClient } = useTreeClient();
  const input = FormNode.inputs.getType(
    nodeId,
    inputId,
    "rich-text",
  )(treeClient);

  const {
    config: { locale },
  } = useRendererContext();
  const { getVariables } = useRendererMethods();
  const variables = getVariables({
    filterPrimitives: (variable): variable is PrimitiveVariable =>
      variable.type !== "multi-select" && !isFileVariable(variable),
  });

  const rendererLabel = getText({
    variables,
    html: input.yRendererLabel.toJSON(),
    locale,
  });

  return (
    <Controller
      rules={{
        required: {
          value: required || input.required,
          message: t("plugins.node.form.generic-input.required.errorMessage"),
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <RichTextEditor
          label={
            input.noRendererLabel
              ? undefined
              : rendererLabel.length > 0
                ? rendererLabel
                : input.label
          }
          value={value}
          onChange={onChange}
          required={required || input.required}
          error={error}
          placeholder={input.placeholder}
          withOptionalLabel
        />
      )}
      name={inputId}
    />
  );
};
