"use client";

import { badgeClasses } from "@mioto/design-system/Badge";
import { FieldGroup } from "@mioto/design-system/Date";
import {
  Button,
  Calendar,
  DateInput,
  FieldError,
} from "@mioto/design-system/Date";
import { Form } from "@mioto/design-system/Form";
import { useTranslations } from "@mioto/locale";
import { Calendar as CalendarIcon } from "@phosphor-icons/react/dist/ssr";
import { DatePicker, Dialog, Label, Popover } from "react-aria-components";
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

export const DateInputRenderer: InputRenderer = ({
  inputId,
  nodeId,
  required,
}) => {
  const {
    config: { locale },
  } = useRendererContext();
  const { treeClient } = useTreeClient();
  const { control } = Form.useFormContext();
  const { getVariables } = useRendererMethods();
  const input = FormNode.inputs.getType(nodeId, inputId, "date")(treeClient);

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
    <Controller
      control={control}
      name={inputId}
      rules={{
        required:
          (required || input.required) &&
          t("plugins.node.form.date.required.error-message"),
      }}
      render={({
        field: { name, value, onChange, onBlur, ref },
        fieldState: { invalid, error },
      }) => {
        return (
          <DatePicker
            className="group flex flex-col gap-1"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            isInvalid={invalid}
            aria-label={
              input.noRendererLabel
                ? rendererLabel.length > 0
                  ? rendererLabel
                  : input.label
                : undefined
            }
          >
            {!input.noRendererLabel && (
              <Label className="flex gap-2 items-center">
                {rendererLabel.length > 0 ? rendererLabel : input.label}
                {!input.required ? (
                  <span className={badgeClasses({ colorScheme: "gray" })}>
                    {t("components.inputs.optional-badge")}
                  </span>
                ) : null}
              </Label>
            )}
            <FieldGroup className="min-w-[208px] w-auto">
              <DateInput className="flex-1 min-w-[150px] px-2 py-1.5" />
              <Button
                variant="tertiary"
                square
                size="small"
                className="border-0 border-l border-gray5 rounded-l-none rounded-r-[3px] h-full"
                focus="inner"
              >
                <CalendarIcon />
              </Button>
            </FieldGroup>
            {error?.message ? <FieldError>{error.message}</FieldError> : null}
            <Popover>
              <Dialog className="bg-white">
                <Calendar />
              </Dialog>
            </Popover>
          </DatePicker>
        );
      }}
    />
  );
};
