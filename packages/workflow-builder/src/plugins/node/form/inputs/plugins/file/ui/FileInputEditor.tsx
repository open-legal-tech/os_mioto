"use client";

import { useTranslations } from "@mioto/locale";
import { Checkbox } from "@mioto/design-system/Checkbox";
import { Form } from "@mioto/design-system/Form";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { Label } from "react-aria-components";
import { useTree, useTreeClient } from "../../../../../../../tree/sync/state";
import { FormNode } from "../../../../exports/plugin";
import { DefaultInputConfig } from "../../../components/InputConfig";
import type { InputConfigurator } from "../../../types/componentTypes";
import { FileInput } from "../FileInputPlugin";

export const FileInputConfigurator: InputConfigurator = ({
  inputId,
  nodeId,
}) => {
  const input = useTree(FormNode.inputs.getType(nodeId, inputId, "file"));

  const { treeClient } = useTreeClient();
  const yRendererLabel = FormNode.inputs
    .getYInput(nodeId, inputId)(treeClient)
    .get("yRendererLabel");

  const t = useTranslations();

  const methods = Form.useForm({
    defaultValues: {
      noLabel: input.noRendererLabel,
      "input-label": input.label,
      required: [input?.required ? "required" : ""],
      acceptedTypePdf: input.accept ? input.accept?.includes("pdf") : true,
      acceptedTypeDocx: input.accept ? input.accept?.includes("docx") : true,
    },
  });

  return (
    <Stack>
      <Form.Provider methods={methods}>
        <Form.Root>
          <DefaultInputConfig
            inputId={inputId}
            inputPlugin={FileInput}
            nodeId={nodeId}
            yRendererLabel={yRendererLabel}
          >
            <Stack className="gap-1">
              <Text className="mt-1">
                {t("plugins.node.form.file.renderer.input.datatype")}
              </Text>
              <Label className="flex gap-1">
                <Checkbox
                  {...methods.register("acceptedTypePdf", {
                    onChange: () =>
                      FileInput.toggleAccept(
                        nodeId,
                        inputId,
                        "pdf",
                      )(treeClient),
                  })}
                />
                PDF
              </Label>
              <Label className="flex gap-1">
                <Checkbox
                  {...methods.register("acceptedTypeDocx", {
                    onChange: () =>
                      FileInput.toggleAccept(
                        nodeId,
                        inputId,
                        "docx",
                      )(treeClient),
                  })}
                />
                Docx (Word)
              </Label>
            </Stack>
          </DefaultInputConfig>
        </Form.Root>
      </Form.Provider>
    </Stack>
  );
};
