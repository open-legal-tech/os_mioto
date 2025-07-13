import Label from "@mioto/design-system/Label";
import { SelectWithCombobox } from "@mioto/design-system/SelectWithCombobox";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import React from "react";
import { isDefined } from "remeda";
import type { MultiSelectCondition } from "../../../../../plugins/edge/complex-logic/conditions/MultiSelect";
import {
  type SelectCondition,
  selectOperators,
} from "../../../../../plugins/edge/complex-logic/conditions/Select";
import type {
  IMultiSelectVariable,
  ISelectVariable,
} from "../../../../../variables/exports/types";
import { OperatorSelector } from "../OperatorSelector";

export const renderSelectComparator = (
  variable: ISelectVariable | IMultiSelectVariable,
  condition: SelectCondition | MultiSelectCondition,
) => {
  const comparatorStrings = variable.values
    .filter(({ id, value }) => condition.comparator?.includes(id ?? value))
    .map((value, index, array) => (
      <span key={value.id}>
        <span className="font-strong">
          {(value.value?.length ?? 0) > 0 ? value.value : "Kein Label"}
        </span>{" "}
        {index < array.length - 1 ? "oder " : " "}
      </span>
    ));

  if (comparatorStrings.length === 0) return null;

  return comparatorStrings;
};

export type SelectOperatorSelectorProps = {
  value: SelectCondition["operator"];
  onOperatorSelect: (
    operator: keyof ReturnType<typeof selectOperators>,
  ) => void;
};

export function SelectOperatorSelector({
  value,
  onOperatorSelect,
}: SelectOperatorSelectorProps) {
  const t = useTranslations();

  return (
    <OperatorSelector
      options={selectOperators(t)}
      value={value}
      onChange={onOperatorSelect}
    />
  );
}

export type SelectConditionSelectorProps = {
  variable: ISelectVariable | IMultiSelectVariable;
  value: string[];
  children?: React.ReactNode;
  onConditionChange?: (
    selectedConditionId: string | string[],
  ) => void | Promise<void>;
};

export function SelectConditionSelector({
  variable,
  value,
  children,
  onConditionChange,
}: SelectConditionSelectorProps) {
  const id = React.useId();
  const t = useTranslations();

  return (
    <Stack className="flex-1 gap-1">
      <Label htmlFor={id}>
        {t(
          "packages.node-editor.logic-configurator.condition.select.condition-selector.label",
        )}
      </Label>
      <SelectWithCombobox
        id={id}
        value={value
          .map((id) => variable.values.find((value) => value.id === id)?.id)
          .filter(isDefined)}
        options={variable.values
          .map((variable) =>
            variable.value
              ? ({
                  id: variable.id,
                  name: variable.value,
                  data: {},
                  type: "option",
                } as const)
              : undefined,
          )
          .filter(isDefined)}
        onSelect={(id) => {
          if (!id) return;

          return onConditionChange?.(id);
        }}
        renderValue={(values) => {
          return (
            <Stack className="gap-2">
              {values.map((value) => (
                <div key={value.id}>{value.name}</div>
              ))}
            </Stack>
          );
        }}
      />
      {children}
    </Stack>
  );
}
