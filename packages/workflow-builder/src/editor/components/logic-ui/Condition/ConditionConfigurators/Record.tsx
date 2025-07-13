import Label from "@mioto/design-system/Label";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import { useLocale, useTranslations } from "@mioto/locale";
import React from "react";
import { match } from "ts-pattern";
import {
  type BooleanCondition,
  booleanOperators,
} from "../../../../../plugins/edge/complex-logic/conditions/Boolean";
import {
  type DateCondition,
  dateOperators,
} from "../../../../../plugins/edge/complex-logic/conditions/Date";
import {
  type MultiSelectCondition,
  multiSelectOperators,
} from "../../../../../plugins/edge/complex-logic/conditions/MultiSelect";
import {
  type NumberCondition,
  numberOperators,
} from "../../../../../plugins/edge/complex-logic/conditions/Number";
import {
  type SelectCondition,
  selectOperators,
} from "../../../../../plugins/edge/complex-logic/conditions/Select";
import {
  type TextCondition,
  textOperators,
} from "../../../../../plugins/edge/complex-logic/conditions/Text";
import {
  type IRecordVariable,
  RecordVariable,
} from "../../../../../variables/exports/types";
import { VariableSelector } from "../VariableSelector";
import {
  BooleanOperatorSelector,
  type BooleanOperatorSelectorProps,
} from "./Boolean";
import {
  DateConditionSelector,
  type DateConditionSelectorProps,
  DateOperatorSelector,
  type DateOperatorSelectorProps,
  renderDateComparator,
} from "./Date";
import {
  NumberConditionSelector,
  type NumberConditionSelectorProps,
  NumberOperatorSelector,
  type NumberOperatorSelectorProps,
  renderNumberComparator,
} from "./Number";
import {
  ReadableConditionPopover,
  type ReadableConditionPopoverProps,
} from "./ReadableCondition";
import {
  SelectConditionSelector,
  type SelectConditionSelectorProps,
  SelectOperatorSelector,
  type SelectOperatorSelectorProps,
  renderSelectComparator,
} from "./SingleSelect";
import {
  TextConditionSelector,
  type TextConditionSelectorProps,
  TextOperatorSelector,
  type TextOperatorSelectorProps,
  renderTextComparator,
} from "./Text";
import type { ConfiguratorProps } from "./types";

export type RecordConfiguratorProps = {
  condition:
    | SelectCondition
    | NumberCondition
    | BooleanCondition
    | MultiSelectCondition
    | TextCondition
    | DateCondition;
  variable: IRecordVariable;
  className?: string;
  onSelectOperatorSelect: SelectOperatorSelectorProps["onOperatorSelect"];
  onNumberOperatorSelect: NumberOperatorSelectorProps["onOperatorSelect"];
  onBooleanOperatorSelect: BooleanOperatorSelectorProps["onOperatorSelect"];
  onSelectConditionChange: SelectConditionSelectorProps["onConditionChange"];
  onNumberConditionChange: NumberConditionSelectorProps["onConditionChange"];
  onMultiSelectOperatorSelect: SelectOperatorSelectorProps["onOperatorSelect"];
  onMultiSelectConditionChange: SelectConditionSelectorProps["onConditionChange"];
  onTextOperatorSelect: TextOperatorSelectorProps["onOperatorSelect"];
  onTextConditionChange: TextConditionSelectorProps["onConditionChange"];
  onDateConditionChange: DateConditionSelectorProps["onConditionChange"];
  onDateOperatorSelect: DateOperatorSelectorProps["onOperatorSelect"];
} & ConfiguratorProps &
  Pick<ReadableConditionPopoverProps, "onReset">;

export function RecordConfigurator({
  condition,
  variable,
  className,
  nodeId,
  onSelectConditionChange,
  onSelectOperatorSelect,
  onNumberConditionChange,
  onNumberOperatorSelect,
  onVariableSelect,
  onBooleanOperatorSelect,
  onMultiSelectConditionChange,
  onMultiSelectOperatorSelect,
  onTextOperatorSelect,
  onTextConditionChange,
  onDateConditionChange,
  onDateOperatorSelect,
  onReset,
}: RecordConfiguratorProps) {
  const locale = useLocale();
  const t = useTranslations();

  const variableValue = condition.variablePath
    ? RecordVariable.getValue(variable, condition.variablePath)
    : variable;

  const VariableConfigurator = match<
    [typeof variableValue, typeof condition],
    {
      OperatorSelector: React.ReactNode;
      ComparatorInput: React.ReactNode;
      renderComparator: React.ReactNode;
      renderOperator: React.ReactNode;
      isMissing?: boolean;
    }
  >([variableValue, condition])
    .with([{ type: "select" }, { type: "select" }], ([variable, condition]) => {
      const operatorConfig = condition.operator
        ? selectOperators(t)[condition.operator]
        : undefined;

      return {
        OperatorSelector: (
          <SelectOperatorSelector
            onOperatorSelect={onSelectOperatorSelect}
            value={condition.operator}
          />
        ),
        ComparatorInput: operatorConfig?.comparator ? (
          <SelectConditionSelector
            key={variable.id}
            variable={variable}
            value={condition.comparator ?? []}
            onConditionChange={onSelectConditionChange}
          />
        ) : null,
        renderComparator: renderSelectComparator(variable, condition),
        renderOperator: condition.operator
          ? selectOperators(t)[condition.operator].label
          : null,
      };
    })
    .with(
      [{ type: "multi-select" }, { type: "multi-select" }],
      ([variable, condition]) => {
        const operatorConfig = condition.operator
          ? selectOperators(t)[condition.operator]
          : undefined;

        return {
          OperatorSelector: (
            <SelectOperatorSelector
              onOperatorSelect={onMultiSelectOperatorSelect}
              value={condition.operator}
            />
          ),
          ComparatorInput: operatorConfig?.comparator ? (
            <SelectConditionSelector
              key={variable.id}
              variable={variable}
              value={condition.comparator ?? []}
              onConditionChange={onMultiSelectConditionChange}
            />
          ) : null,
          renderComparator: renderSelectComparator(variable, condition),
          renderOperator: condition.operator
            ? multiSelectOperators(t)[condition.operator].label
            : null,
        };
      },
    )
    .with([{ type: "number" }, { type: "number" }], ([variable, condition]) => {
      const operatorConfig = condition.operator
        ? numberOperators(t)[condition.operator]
        : undefined;

      return {
        OperatorSelector: (
          <NumberOperatorSelector
            value={condition.operator}
            onOperatorSelect={onNumberOperatorSelect}
          />
        ),
        ComparatorInput: operatorConfig?.comparator ? (
          <NumberConditionSelector
            key={variable.id}
            variable={variable}
            value={condition.comparator?.toString() ?? ""}
            condition={condition}
            onConditionChange={onNumberConditionChange}
          />
        ) : null,
        renderComparator: renderNumberComparator(condition),
        renderOperator: condition.operator
          ? numberOperators(t)[condition.operator].label
          : null,
      };
    })
    .with([{ type: "boolean" }, { type: "boolean" }], ([_, condition]) => {
      const { childId } = RecordVariable.splitVariableId(
        condition.variablePath,
      );

      return {
        OperatorSelector: (
          <BooleanOperatorSelector
            value={condition.operator}
            onOperatorSelect={onBooleanOperatorSelect}
            type={childId ? "variable" : "block"}
          />
        ),
        ComparatorInput: null,
        renderComparator: null,
        renderOperator: condition.operator
          ? booleanOperators(t, childId ? "variable" : "block")[
              condition.operator
            ].label
          : null,
      };
    })
    .with([{ type: "record" }, { type: "boolean" }], ([_, condition]) => {
      const { childId } = RecordVariable.splitVariableId(
        condition.variablePath,
      );

      return {
        OperatorSelector: (
          <BooleanOperatorSelector
            value={condition.operator}
            onOperatorSelect={onBooleanOperatorSelect}
            type={childId ? "variable" : "block"}
          />
        ),
        ComparatorInput: null,
        renderComparator: null,
        renderOperator: booleanOperators(t, childId ? "variable" : "block")[
          condition.operator
        ].label,
      };
    })
    .with([{ type: "text" }, { type: "text" }], ([variable, condition]) => {
      const operatorConfig = condition.operator
        ? textOperators(t)[condition.operator]
        : undefined;

      return {
        OperatorSelector: (
          <TextOperatorSelector
            value={condition.operator}
            onOperatorSelect={onTextOperatorSelect}
          />
        ),
        ComparatorInput: operatorConfig?.comparator ? (
          <TextConditionSelector
            key={variable.id}
            variable={variable}
            value={condition.comparator?.toString() ?? ""}
            condition={condition}
            onConditionChange={onTextConditionChange}
          />
        ) : null,
        renderComparator: renderTextComparator(condition),
        renderOperator: condition.operator
          ? textOperators(t)[condition.operator].label
          : undefined,
      };
    })
    .with([{ type: "date" }, { type: "date" }], ([variable, condition]) => {
      const operatorConfig = condition.operator
        ? dateOperators(t)[condition.operator]
        : undefined;

      return {
        OperatorSelector: (
          <DateOperatorSelector
            value={condition.operator}
            onOperatorSelect={onDateOperatorSelect}
          />
        ),
        ComparatorInput: operatorConfig?.comparator ? (
          <DateConditionSelector
            key={variable.id}
            variable={variable}
            value={condition.comparator}
            condition={condition}
            onConditionChange={onDateConditionChange}
          />
        ) : null,
        renderComparator: renderDateComparator(condition, locale),
        renderOperator: condition.operator
          ? dateOperators(t)[condition.operator].label
          : undefined,
      };
    })
    .otherwise(() => ({
      OperatorSelector: null,
      ComparatorInput: null,
      renderComparator: null,
      renderOperator: null,
      isMissing: true,
    }));

  const id = React.useId();

  return (
    <ReadableConditionPopover
      variableName={
        variable.name === variableValue?.name ? undefined : variableValue?.name
      }
      Comparator={VariableConfigurator.renderComparator}
      Operator={VariableConfigurator.renderOperator}
      className={className}
      recordVariableName={variable.name}
      isMissing={VariableConfigurator.isMissing}
      onReset={onReset}
    >
      <Stack className="gap-2">
        <Row className="gap-2 items-end">
          <Stack className="flex-1 gap-1">
            <Label htmlFor={id}>Variable</Label>
            <VariableSelector
              id={id}
              nodeId={nodeId}
              value={variableValue ? variableValue.id : undefined}
              onSelect={onVariableSelect}
            />
          </Stack>
          {VariableConfigurator?.OperatorSelector}
        </Row>
        {VariableConfigurator?.ComparatorInput}
      </Stack>
    </ReadableConditionPopover>
  );
}
