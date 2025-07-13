"use client";

import { Form } from "@mioto/design-system/Form";
import { useTranslations } from "@mioto/locale";
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

export const EmailInputRenderer: InputRenderer = ({
  inputId,
  nodeId,
  required,
}) => {
  const {
    config: { locale },
  } = useRendererContext();
  const { register } = Form.useFormContext();
  const { treeClient } = useTreeClient();
  const { getVariables } = useRendererMethods();
  const input = FormNode.inputs.getType(nodeId, inputId, "email")(treeClient);

  const variables = getVariables({
    filterPrimitives: (variable): variable is PrimitiveVariable =>
      variable.type !== "multi-select" && !isFileVariable(variable),
  });

  const rendererLabel = getText({
    variables,
    html: input.yRendererLabel.toJSON(),
    locale,
  });

  const t = useTranslations();

  return (
    (<Form.Field
      Label={
        input.noRendererLabel
          ? ""
          : rendererLabel.length > 0
            ? rendererLabel
            : input.label
      }
      required={required || input.required}
      withOptionalLabel
    >
      <Form.Input
        placeholder={input.placeholder}
        {...register(input.id, {
          required: {
            value: required || input.required,
            message: t("plugins.node.form.generic-input.required.errorMessage"),
          },
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t("plugins.node.form.email.pattern.errorMessage"),
          },
        })}
        autoComplete="off"
        className="bg-gray1"
      />
    </Form.Field>)
  );
};
