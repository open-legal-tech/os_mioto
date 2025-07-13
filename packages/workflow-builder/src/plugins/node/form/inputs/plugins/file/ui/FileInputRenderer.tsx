"use client";

import { buttonClasses } from "@mioto/design-system/Button";
import { FileInput } from "@mioto/design-system/FileInput";
import { Form } from "@mioto/design-system/Form";
import { Row } from "@mioto/design-system/Row";
import { Text } from "@mioto/design-system/Text";
import { useLocale, useTranslations } from "@mioto/locale";
import { File } from "@phosphor-icons/react/dist/ssr";
import { useWatch } from "react-hook-form";
import { useRendererMethods } from "../../../../../../../renderer/Context";
import { getText } from "../../../../../../../rich-text-editor/exports/RichInput/transformers/text";
import { useTreeClient } from "../../../../../../../tree/sync/treeStore/TreeContext";
import {
  type PrimitiveVariable,
  isFileVariable,
} from "../../../../../../../variables/exports/types";
import { FormNode } from "../../../../exports/plugin";
import type { InputRenderer } from "../../../types/componentTypes";

export const FileInputRenderer: InputRenderer = ({
  inputId,
  nodeId,
  required,
}) => {
  const { register } = Form.useFormContext();
  const { treeClient } = useTreeClient();
  const { getVariables } = useRendererMethods();
  const currentValue = useWatch({ name: inputId });
  const input = FormNode.inputs.getType(nodeId, inputId, "file")(treeClient);

  const hasCurrentValue = !!currentValue?.uuid || currentValue?.length > 0;

  const fileName = currentValue?.fileName || currentValue?.[0]?.name;

  const variables = getVariables({
    filterPrimitives: (variable): variable is PrimitiveVariable =>
      variable.type !== "multi-select" && !isFileVariable(variable),
  });

  const locale = useLocale();

  const rendererLabel = getText({
    variables,
    html: input.yRendererLabel.toJSON(),
    locale,
  });

  const t = useTranslations("plugins.node.form.file");

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  return (
    <Form.Field
      Label={
        input.noRendererLabel
          ? ""
          : rendererLabel.length > 0
            ? `${rendererLabel} (max. 10MB)`
            : `${input.label} (max. 10MB)`
      }
      name={input.id}
      required={required || input.required}
      withOptionalLabel
    >
      <Row
        className={`items-center border border-gray5 p-4 rounded flex-wrap gap-2 ${
          hasCurrentValue ? "justify-between" : "justify-center"
        }`}
      >
        {hasCurrentValue && (
          <Row className="gap-1 items-center">
            <File />
            <Text>{fileName}</Text>
          </Row>
        )}
        <FileInput
          className={buttonClasses({
            size: "small",
            variant: hasCurrentValue ? "secondary" : "primary",
          })}
          {...register(input.id, {
            required: hasCurrentValue
              ? false
              : {
                  value: required || input.required,
                  message: t("renderer.input.required.error.message"),
                },
            validate: {
              fileSize: (value) => {
                if (!value[0]?.size) return true;

                return value[0].size <= MAX_FILE_SIZE
                  ? true
                  : t("renderer.input.validate.error");
              },
            },
          })}
          accept={
            input.accept
              ? `${input.accept?.includes("pdf") ? ".pdf" : ""}, ${
                  input.accept?.includes("docx") ? ".doc, .docx" : ""
                }`
              : ".pdf,.doc,.docx"
          }
        >
          {hasCurrentValue
            ? t("renderer.input.withValue")
            : t("renderer.input.noValue")}
        </FileInput>
      </Row>
    </Form.Field>
  );
};
