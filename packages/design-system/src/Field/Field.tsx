"use client";;
import { FatalError } from "@mioto/errors";
import { useTranslations } from "@mioto/locale";
import * as React from "react";
import { badgeClasses } from "../Badge/Badge";
import { FormError, Label as FormLabel, type InputProps } from "../Form/Form";
import type { LabelProps } from "../Label/Label";
import { rowClasses } from "../Row/Row";
import { stackClasses } from "../Stack/Stack";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import { twMerge } from "../tailwind/merge";
import "./Field.css";

import type { JSX } from "react";

export type FieldTopRightProps = { style: React.CSSProperties };

export type FieldProps = {
  children: JSX.Element;
  className?: string;
  name?: string;
  Label: React.ReactNode;
  TopRight?: ({ style }: FieldTopRightProps) => JSX.Element;
  layout?:
    | "block"
    | "inline-left"
    | "inline-right"
    | "no-label"
    | "constrained-left"
    | "constrained-right";
  required?: boolean;
  style?: React.CSSProperties;
  labelSize?: LabelProps["size"];
  size?: InputProps["size"];
  labelClassName?: string;
  withOptionalLabel?: boolean;
};

export function Field({
  Label,
  TopRight,
  children,
  className,
  layout = "block",
  name: optionalName,
  required: optionalRequired,
  style,
  labelSize = "medium",
  labelClassName,
  size,
  withOptionalLabel = false,
}: FieldProps) {
  const t = useTranslations();

  if (!React.Children.only(children)) {
    throw new FatalError({
      code: "wrong_configuration",
      debugMessage:
        "The Field component can only ever wrap one Input as a child.",
    });
  }

  const name = optionalName ? optionalName : children.props.name;
  const id = children.props.id;
  const required = optionalRequired
    ? optionalRequired
    : children.props.required;

  if (!name && !id)
    throw new FatalError({
      code: "wrong_configuration",
      debugMessage: `The Field component or its input child needs a name or an id to associate the label with the input.`,
    });

  const isLabelHidden = layout === "no-label";

  const WrappedLabel =
    typeof Label === "string" ? (
      <div
        className={twMerge("grid gap-2 field flex-1 items-center", className)}
        data-layout={layout}
      >
        <FormLabel
          htmlFor={id ?? name}
          aria-label={Label}
          size={labelSize}
          className="max-w-max"
          style={{
            gridArea:
              TopRight || layout !== "block"
                ? "label"
                : "label / label / topRight / topRight",
          }}
        >
          <span
            className={rowClasses({}, ["gap-2 items-center", labelClassName])}
            style={{
              gridArea: "label",
              wordBreak: typeof Label === "string" ? "break-word" : undefined,
            }}
          >
            {Label}
            {!required && withOptionalLabel ? (
              <span className={badgeClasses({ colorScheme: "gray" })}>
                {t("components.inputs.optional-badge")}
              </span>
            ) : null}
          </span>
        </FormLabel>
        <span style={{ gridArea: "input" }} className="overflow-hidden">
          {children}
        </span>
        {TopRight ? (
          <TopRight style={{ gridArea: "topRight", justifySelf: "end" }} />
        ) : null}
      </div>
    ) : (
      <div
        className={twMerge("grid gap-2 field flex-1 items-center", className)}
        data-layout={layout}
      >
        <FormLabel
          htmlFor={id ?? name}
          size={labelSize}
          style={{
            gridArea:
              TopRight || layout !== "block"
                ? "label"
                : "label / label / topRight / topRight",
          }}
        >
          {Label}
        </FormLabel>
        <span style={{ gridArea: "input" }} className="overflow-hidden">
          {children}
        </span>
        {TopRight ? (
          <TopRight style={{ gridArea: "topRight", justifySelf: "end" }} />
        ) : null}
      </div>
    );

  return (
    <div className={stackClasses({}, [className])} style={style}>
      {isLabelHidden ? (
        <>
          <VisuallyHidden>
            <FormLabel>{Label}</FormLabel>
          </VisuallyHidden>
          <span style={{ gridArea: "input" }} className="overflow-hidden">
            {children}
          </span>
        </>
      ) : (
        WrappedLabel
      )}
      {name ? (
        <FormError
          size={size ?? undefined}
          data-test={`error-${name}`}
          name={name}
          className="mt-2"
          style={{ gridArea: "error" }}
        />
      ) : null}
    </div>
  );
}
