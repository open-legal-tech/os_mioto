"use client";

import { Form } from "@mioto/design-system/Form";
import { useTranslations } from "@mioto/locale";
import * as React from "react";
import type { TAnswer } from "../../types/answer";
import { labelContainerClasses } from "./container";

type ElementProps = {
  answer: TAnswer;
  name: string;
} & Form.CheckboxProps;

export const CheckboxElement = React.forwardRef<HTMLInputElement, ElementProps>(
  ({ answer, ...props }, ref) => {
    const t = useTranslations("plugins.node.form");

    return (
      <label className={`${labelContainerClasses} multi-select-item`}>
        <Form.Checkbox {...props} ref={ref} className="focus-within:no-focus" />
        {answer.value ? (
          answer.value
        ) : (
          <span style={{ fontStyle: "italic" }}>
            {t("missing-answer-text")}
          </span>
        )}
      </label>
    );
  },
);
