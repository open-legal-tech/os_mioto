import { useTranslations } from "@mioto/locale";
import {
  type BooleanCondition,
  booleanOperators,
} from "../../../../../plugins/edge/complex-logic/conditions/Boolean";
import { OperatorSelector } from "../OperatorSelector";

export type BooleanOperatorSelectorProps = {
  value: BooleanCondition["operator"];
  onOperatorSelect: (operator: BooleanCondition["operator"]) => void;
  type: Parameters<typeof booleanOperators>[1];
};

export function BooleanOperatorSelector({
  onOperatorSelect,
  value,
  type,
}: BooleanOperatorSelectorProps) {
  const t = useTranslations();

  return (
    <OperatorSelector
      options={booleanOperators(t, type)}
      value={String(value) as "true" | "false" | undefined}
      onChange={onOperatorSelect}
    />
  );
}
