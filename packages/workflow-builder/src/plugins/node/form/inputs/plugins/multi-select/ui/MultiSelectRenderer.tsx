"use client";

import { badgeClasses } from "@mioto/design-system/Badge";
import { Form } from "@mioto/design-system/Form";
import { Stack } from "@mioto/design-system/Stack";
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
import { CheckboxElement } from "../../../components/RendererAnswers/Checkbox";
import type { InputRenderer } from "../../../types/componentTypes";

export const MultiSelectInputRenderer: InputRenderer = ({
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
  const input = FormNode.inputs.getType(
    nodeId,
    inputId,
    "multi-select",
  )(treeClient);

  const variables = getVariables({
    filterPrimitives: (variable): variable is PrimitiveVariable =>
      variable.type !== "multi-select" && !isFileVariable(variable),
  });

  const rendererLabel = getText({
    locale,
    variables,
    html: input.yRendererLabel.toJSON(),
  });

  const t = useTranslations();

  return (
    <fieldset>
      <Stack className="gap-2">
        <legend className="flex gap-2 items-center">
          {input.noRendererLabel
            ? ""
            : rendererLabel.length > 0
              ? rendererLabel
              : input.label}
          {!input.required ? (
            <span className={badgeClasses({ colorScheme: "gray" })}>
              {t("components.inputs.optional-badge")}
            </span>
          ) : null}
        </legend>
        {input.answers.map((answer) => {
          return (
            <CheckboxElement
              {...register(input.id, {
                validate: (value) => {
                  if (required || input.required) {
                    if (value.length === 0) {
                      return t("components.group-input.required.errorMessage");
                    }
                  }

                  return true;
                },
              })}
              value={answer.id}
              answer={answer}
              key={answer.id}
            />
          );
        })}
      </Stack>
    </fieldset>
  );
};
