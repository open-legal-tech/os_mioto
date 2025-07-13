import { Form } from "@mioto/design-system/Form";
import { Stack } from "@mioto/design-system/Stack";
import { useTree, useTreeClient } from "../../../../../../../tree/sync/state";
import { FormNode } from "../../../../exports/plugin";
import { InputConfig } from "../../../components/InputConfig";
import type { InputConfigurator } from "../../../types/componentTypes";
import { DateInput } from "../DateInputPlugin";

export const DateInputEditor: InputConfigurator = ({ inputId, nodeId }) => {
  const { treeClient } = useTreeClient();
  const input = useTree(FormNode.inputs.getType(nodeId, inputId, ["date"]));

  const yRendererLabel = FormNode.inputs
    .getYInput(
      nodeId,
      inputId,
    )(treeClient)
    .get("yRendererLabel");

  const methods = Form.useForm({
    defaultValues: {
      noLabel: input.noRendererLabel,
      "input-label": input.label,
      required: [input?.required ? "required" : ""],
    },
  });

  return (
    <Stack>
      <Form.Provider methods={methods}>
        <Form.Root>
          <InputConfig.Container>
            <InputConfig.LabelOption
              onNameChange={(newName) =>
                DateInput.updateLabel(nodeId, inputId, newName)(treeClient)
              }
            />
            <InputConfig.RendererLabelOption
              onNoLabelChange={(newValue) =>
                DateInput.updateNoRendererLabel(
                  nodeId,
                  inputId,
                  newValue,
                )(treeClient)
              }
              nodeId={nodeId}
              yRendererLabel={yRendererLabel}
            />
            <InputConfig.RequiredOption
              onRequiredChange={(newValue) =>
                DateInput.updateRequired(nodeId, inputId, newValue)(treeClient)
              }
            />
          </InputConfig.Container>
        </Form.Root>
      </Form.Provider>
    </Stack>
  );
};
