import { Form } from "@mioto/design-system/Form";
import { Stack } from "@mioto/design-system/Stack";
import { useTree, useTreeClient } from "../../../../../../../tree/sync/state";
import { FormNode } from "../../../../exports/plugin";
import { InputConfig } from "../../../components/InputConfig";
import type { InputConfigurator } from "../../../types/componentTypes";
import { FormattedTextAreaInput } from "../FormattedTextAreaInputPlugin";

export const FormattedTextInputEditor: InputConfigurator = ({
  inputId,
  nodeId,
}) => {
  const { treeClient } = useTreeClient();
  const input = useTree(
    FormNode.inputs.getType(nodeId, inputId, ["rich-text"]),
  );

  const yInput = FormNode.inputs.getYInput(nodeId, inputId)(treeClient);
  const yRendererLabel = yInput.get("yRendererLabel");

  const methods = Form.useForm({
    defaultValues: {
      noLabel: input.noRendererLabel,
      "input-label": input.label,
      required: [input?.required ? "required" : ""],
      placeholder: input.placeholder,
    },
  });

  return (
    <Stack>
      <Form.Provider methods={methods}>
        <Form.Root>
          <InputConfig.Container>
            <InputConfig.LabelOption
              onNameChange={(newName) =>
                FormattedTextAreaInput.updateLabel(
                  nodeId,
                  inputId,
                  newName,
                )(treeClient)
              }
            />
            <InputConfig.RendererLabelOption
              onNoLabelChange={(newValue) =>
                FormattedTextAreaInput.updateNoRendererLabel(
                  nodeId,
                  inputId,
                  newValue,
                )(treeClient)
              }
              nodeId={nodeId}
              yRendererLabel={yRendererLabel}
            />
            <InputConfig.PlaceholderOption
              onPlaceholderOptionChange={(newLabel) =>
                FormattedTextAreaInput.updatePlaceholder(
                  nodeId,
                  inputId,
                  newLabel,
                )(treeClient)
              }
            />
            <InputConfig.RequiredOption
              onRequiredChange={(newValue) =>
                FormattedTextAreaInput.updateRequired(
                  nodeId,
                  inputId,
                  newValue,
                )(treeClient)
              }
            />
          </InputConfig.Container>
        </Form.Root>
      </Form.Provider>
    </Stack>
  );
};
