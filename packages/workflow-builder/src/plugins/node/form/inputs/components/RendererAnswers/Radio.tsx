"use client";

import { Form } from "@mioto/design-system/Form";
import { useTranslations } from "@mioto/locale";
import * as React from "react";
import type { TAnswer } from "../../types/answer";
import { labelContainerClasses } from "./container";

type Props = {
  answers: TAnswer[];
  name: string;
  activeValue: string;
  required: boolean;
};

export const RendererRadioGroup = React.forwardRef<HTMLDivElement, Props>(
  function Answers({ answers, name, activeValue, required }, ref) {
    const t = useTranslations();
    const { register } = Form.useFormContext();

    return (
      <Form.Radio.Group ref={ref} className="gap-1">
        {answers.map((answer) => (
          <label
            key={answer.id}
            className={`${labelContainerClasses} select-item`}
            data-active={activeValue === answer.id}
          >
            <Form.Radio.Item
              {...register(name, {
                required: {
                  value: required,
                  message: t("components.group-input.required.errorMessage"),
                },
              })}
              value={answer.id}
              className="focus-within:no-focus"
            />
            {answer.value ? (
              answer.value
            ) : (
              <span style={{ fontStyle: "italic" }}>
                {t("plugins.node.form.missing-answer-text")}
              </span>
            )}
          </label>
        ))}
      </Form.Radio.Group>
    );
  },
);
