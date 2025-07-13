"use client";

import { Form } from "@mioto/design-system/Form";
import Input from "@mioto/design-system/Input";
import Label from "@mioto/design-system/Label";
import { Row } from "@mioto/design-system/Row";
import Separator from "@mioto/design-system/Separator";
import { Stack } from "@mioto/design-system/Stack";
import { Switch } from "@mioto/design-system/Switch";
import { useTranslations } from "@mioto/locale";
import type { ChangeEvent } from "react";
import { useTree, useTreeClient } from "../../../../../../../tree/sync/state";
import { FormNode } from "../../../../exports/plugin";
import { InputConfig } from "../../../components/InputConfig";
import type { InputConfigurator } from "../../../types/componentTypes";
import { NumberInputPlugin } from "../NumberInputPlugin";

const NumberInput = new NumberInputPlugin();

export const NumberInputEditor: InputConfigurator = ({ inputId, nodeId }) => {
  const { treeClient } = useTreeClient();

  const input = useTree(FormNode.inputs.getType(nodeId, inputId, "number"));

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
      max: input?.max,
      min: input?.min ?? 0,
      placeholder: input?.placeholder,
    },
  });

  const t = useTranslations();

  return (
    <Stack>
      <Form.Provider methods={methods}>
        <Form.Root>
          <InputConfig.Container>
            <InputConfig.LabelOption
              onNameChange={(newName) =>
                NumberInput.updateLabel(nodeId, inputId, newName)(treeClient)
              }
            />
            <InputConfig.RendererLabelOption
              nodeId={nodeId}
              yRendererLabel={yRendererLabel}
              onNoLabelChange={(newValue) =>
                NumberInput.updateNoRendererLabel(
                  nodeId,
                  inputId,
                  newValue,
                )(treeClient)
              }
            />
            <InputConfig.PlaceholderOption
              onPlaceholderOptionChange={(newLabel) =>
                NumberInput.updatePlaceholder(
                  nodeId,
                  inputId,
                  newLabel,
                )(treeClient)
              }
            />
            <InputConfig.RequiredOption
              onRequiredChange={(newValue) =>
                NumberInput.updateRequired(
                  nodeId,
                  inputId,
                  newValue,
                )(treeClient)
              }
            />
            <Separator />
            <Row className="gap-2">
              <Form.Field
                Label={t("plugins.node.form.number.min.label")}
                className="flex-1"
              >
                <Form.Input
                  type="number"
                  {...methods.register("min", {
                    onChange: (event: ChangeEvent<HTMLInputElement>) =>
                      NumberInput.updateMin(
                        nodeId,
                        inputId,
                        Number.isNaN(event.target.valueAsNumber)
                          ? undefined
                          : event.target.valueAsNumber,
                      )(treeClient),
                  })}
                  className="bg-white"
                />
              </Form.Field>
              <Form.Field
                Label={t("plugins.node.form.number.max.label")}
                className="flex-1"
              >
                <Form.Input
                  type="number"
                  {...methods.register("max", {
                    onChange: (event: ChangeEvent<HTMLInputElement>) =>
                      NumberInput.updateMax(
                        nodeId,
                        inputId,
                        Number.isNaN(event.target.valueAsNumber)
                          ? undefined
                          : event.target.valueAsNumber,
                      )(treeClient),
                  })}
                  className="bg-white"
                />
              </Form.Field>
            </Row>
            <Stack>
              <Row className="mb-2 justify-between items-center">
                <Label className="font-weak">
                  {t("plugins.node.form.number.round-to.label")}
                </Label>
                <Switch.Root
                  checked={input.roundTo != null}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      return NumberInput.disableRound(
                        nodeId,
                        inputId,
                      )(treeClient);
                    }

                    NumberInput.updateRound(nodeId, inputId, 2)(treeClient);
                  }}
                >
                  <Switch.Thumb />
                </Switch.Root>
              </Row>
              {input.roundTo != null ? (
                <Input
                  type="number"
                  placeholder="2"
                  value={input.roundTo}
                  min={1}
                  onChange={(event) => {
                    const value = Number.isNaN(event.target.valueAsNumber)
                      ? 1
                      : (event.target.valueAsNumber ?? 1);

                    NumberInput.updateRound(nodeId, inputId, value)(treeClient);
                  }}
                />
              ) : null}
            </Stack>
          </InputConfig.Container>
        </Form.Root>
      </Form.Provider>
    </Stack>
  );
};
