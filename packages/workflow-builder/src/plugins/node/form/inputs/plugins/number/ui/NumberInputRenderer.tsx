"use client";

import { Form } from "@mioto/design-system/Form";
import { useTranslations } from "@mioto/locale";
import { Controller } from "react-hook-form";
import { isNumber } from "remeda";
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

export const NumberInputRenderer: InputRenderer = ({
  inputId,
  nodeId,
  required,
}) => {
  const {
    config: { locale },
  } = useRendererContext();
  const { treeClient } = useTreeClient();
  const { getVariables } = useRendererMethods();
  const input = FormNode.inputs.getType(nodeId, inputId, "number")(treeClient);

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
    <Form.Field
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
      <Controller
        name={input.id}
        rules={{
          required: {
            value: required || input.required,
            message: t("plugins.node.form.generic-input.required.errorMessage"),
          },
          max: isNumber(input.max)
            ? {
                value: input.max,
                message: t("plugins.node.form.number.max.errorMessage", {
                  maxValue: input.max,
                }),
              }
            : undefined,
          min: {
            value: isNumber(input.min) ? input.min : 0,
            message: t("plugins.node.form.number.min.errorMessage", {
              minValue: input.min ?? 0,
            }),
          },
        }}
        render={({
          field: { value, onChange, onBlur, ref, name },
          fieldState: { invalid, error },
        }) => (
          <Form.NumberField
            maxValue={input.max}
            minValue={input.min}
            isRequired={required || input.required}
            name={name}
            onBlur={onBlur}
            value={value}
            onChange={onChange}
            className="bg-gray1"
            ref={ref}
            isInvalid={invalid}
            errorMessage={error?.message}
            placeholder={input.placeholder}
          />
        )}
      />
    </Form.Field>
  );
};
