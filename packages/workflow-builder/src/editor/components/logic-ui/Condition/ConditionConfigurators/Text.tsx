import { Form } from "@mioto/design-system/Form";
import Label from "@mioto/design-system/Label";
import { useTranslations } from "@mioto/locale";
import {
  type TextCondition,
  textOperators,
} from "../../../../../plugins/edge/complex-logic/conditions/Text";
import type { ITextVariable } from "../../../../../variables/exports/types";
import { OperatorSelector } from "../OperatorSelector";

export const renderTextComparator = (condition: TextCondition) =>
  condition.comparator != null ? (
    <span className="font-strong">{condition.comparator}</span>
  ) : null;

export type TextOperatorSelectorProps = {
  value: TextCondition["operator"];
  onOperatorSelect: (operator: keyof typeof textOperators) => void;
};

export function TextOperatorSelector({
  onOperatorSelect,
  value,
}: TextOperatorSelectorProps) {
  const t = useTranslations();

  return (
    <OperatorSelector
      options={textOperators(t)}
      value={value}
      onChange={onOperatorSelect}
    />
  );
}

export type TextConditionSelectorProps = {
  variable: ITextVariable;
  value: string;
  condition: TextCondition;
  children?: React.ReactNode;
  onConditionChange: (value: string) => void;
};

export const TextConditionSelector = ({
  variable,
  condition,
  onConditionChange,
}: TextConditionSelectorProps) => {
  const id = `comparator ${variable.id}`;
  const t = useTranslations();

  return (
    <>
      <Label className="mt-1" htmlFor={id}>
        {t(
          "packages.node-editor.logic-configurator.condition.text.condition-selector.label",
        )}
      </Label>
      <Form.Input
        id={id}
        className="bg-white"
        key={variable.id}
        value={condition.comparator ?? ""}
        onChange={(event) => onConditionChange(event.target.value)}
      />
    </>
  );
};
