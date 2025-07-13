import {
  DateFormatter,
  getLocalTimeZone,
  parseDate,
} from "@internationalized/date";
import { Button, Calendar, DateInput } from "@mioto/design-system/Date";
import { FieldGroup } from "@mioto/design-system/Date";
import { useTranslations } from "@mioto/locale";
import { Calendar as CalendarIcon } from "@phosphor-icons/react/dist/ssr";
import { DatePicker, Dialog, Label, Popover } from "react-aria-components";
import {
  type DateCondition,
  dateOperators,
} from "../../../../../plugins/edge/complex-logic/conditions/Date";
import type { IDateVariable } from "../../../../../variables/exports/types";
import { OperatorSelector } from "../OperatorSelector";

export const renderDateComparator = (
  condition: DateCondition,
  locale: string,
) => {
  if (!condition.comparator) return null;
  const date = parseDate(condition.comparator);
  const formatter = new DateFormatter(locale);

  return condition.comparator != null ? (
    <span className="font-strong">
      {formatter.format(date.toDate(getLocalTimeZone()))}
    </span>
  ) : null;
};

export type DateOperatorSelectorProps = {
  value: DateCondition["operator"];
  onOperatorSelect: (operator: keyof typeof dateOperators) => void;
};

export function DateOperatorSelector({
  onOperatorSelect,
  value,
}: DateOperatorSelectorProps) {
  const t = useTranslations();

  return (
    <OperatorSelector
      options={dateOperators(t)}
      value={value}
      onChange={onOperatorSelect}
    />
  );
}

export type DateConditionSelectorProps = {
  variable: IDateVariable;
  value?: string;
  condition: DateCondition;
  children?: React.ReactNode;
  onConditionChange: (value: string) => void;
};

export const DateConditionSelector = ({
  variable,
  condition,
  onConditionChange,
}: DateConditionSelectorProps) => {
  const id = `comparator ${variable.id}`;
  const t = useTranslations();

  return (
    <DatePicker
      className="group flex flex-col gap-1"
      value={condition.comparator ? parseDate(condition.comparator) : undefined}
      onChange={(value) => {
        if (value) return onConditionChange(value.toString());
      }}
    >
      <Label className="mt-1" htmlFor={id}>
        {t(
          "packages.node-editor.logic-configurator.condition.text.condition-selector.label",
        )}
      </Label>
      <FieldGroup className="min-w-[208px] w-auto">
        <DateInput className="flex-1 min-w-[150px] px-2 py-1.5" />
        <Button variant="tertiary" square size="small" className="mr-2">
          <CalendarIcon />
        </Button>
      </FieldGroup>
      <Popover>
        <Dialog>
          <Calendar />
        </Dialog>
      </Popover>
    </DatePicker>
  );
};
