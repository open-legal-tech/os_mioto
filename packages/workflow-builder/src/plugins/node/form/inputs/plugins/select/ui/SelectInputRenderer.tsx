"use client";

import { Form } from "@mioto/design-system/Form";
import { Stack } from "@mioto/design-system/Stack";
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
import { RendererRadioGroup } from "../../../components/RendererAnswers/Radio";
import type { InputRenderer } from "../../../types/componentTypes";

export const SelectInputRendererComponent: InputRenderer = ({
  inputId,
  nodeId,
  className,
  required,
}) => {
  const {
    config: { locale },
  } = useRendererContext();
  const { watch } = Form.useFormContext();
  const { treeClient } = useTreeClient();
  const { getVariables } = useRendererMethods();
  const input = FormNode.inputs.getType(nodeId, inputId, "select")(treeClient);

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
    <Form.Field
      Label={
        input.noRendererLabel
          ? ""
          : rendererLabel.length > 0
            ? rendererLabel
            : input.label
      }
      name={input.id}
      required={required || input.required}
      className={className}
      withOptionalLabel
    >
      <Stack className="gap-2">
        <RendererRadioGroup
          required={required || input.required}
          name={input.id}
          answers={input.answers}
          key={input.id}
          activeValue={watch(input.id)}
        />
      </Stack>
    </Form.Field>
  );
};
