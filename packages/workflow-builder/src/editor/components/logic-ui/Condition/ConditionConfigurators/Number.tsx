import { Form } from "@mioto/design-system/Form";
import Label from "@mioto/design-system/Label";
import { useTranslations } from "@mioto/locale";
import {
  type NumberCondition,
  numberOperators,
} from "../../../../../plugins/edge/complex-logic/conditions/Number";
import type { INumberVariable } from "../../../../../variables/exports/types";
import { OperatorSelector } from "../OperatorSelector";

export const renderNumberComparator = (condition: NumberCondition) =>
  condition.comparator != null ? (
    <span className="font-strong">{condition.comparator}</span>
  ) : null;

export type NumberOperatorSelectorProps = {
  value: NumberCondition["operator"];
  onOperatorSelect: (
    operator: keyof ReturnType<typeof numberOperators>,
  ) => void;
};

export function NumberOperatorSelector({
  onOperatorSelect,
  value,
}: NumberOperatorSelectorProps) {
  const t = useTranslations();

  return (
    <OperatorSelector
      options={numberOperators(t)}
      value={value}
      onChange={onOperatorSelect}
    />
  );
}

export type NumberConditionSelectorProps = {
  variable: INumberVariable;
  value: string;
  condition: NumberCondition;
  children?: React.ReactNode;
  onConditionChange: (value: number) => void;
};

export const NumberConditionSelector = ({
  variable,
  condition,
  onConditionChange,
}: NumberConditionSelectorProps) => {
  const id = `comparator ${variable.id}`;
  const t = useTranslations();

  return (
    <>
      <Label className="mt-1" htmlFor={id}>
        {t(
          "packages.node-editor.logic-configurator.condition.number.condition-selector.label",
        )}
      </Label>
      <Form.Input
        id={id}
        className="bg-white"
        key={variable.id}
        value={condition.comparator ?? ""}
        type="number"
        onChange={(event) => onConditionChange(event.target.valueAsNumber)}
      />
    </>
  );
};
