import { Row } from "@mioto/design-system/Row";
import { Select } from "@mioto/design-system/Select";
import { menuItemClasses } from "@mioto/design-system/classes/menuClasses";
import { useTranslations } from "@mioto/locale";
import { entries } from "remeda";

type Props<TOperators extends string = string> = {
  value?: string;
  onChange: (value: TOperators) => void;
  options: Record<TOperators, { label: string; type: "short" | "long" }>;
};

export function OperatorSelector<TKeys extends string = string>({
  onChange,
  value,
  options,
}: Props<TKeys>) {
  const select = Select.useSelectStore({
    value,
    setValue: onChange,
  });

  const t = useTranslations();

  return (
    <Row>
      <Select.Input
        options={entries(options).map(([key, { label }]) => ({
          type: "option",
          id: key,
          name: label,
          data: undefined,
        }))}
        store={select}
        aria-label={t(
          "packages.node-editor.logic-configurator.operator-selector.aria-label",
          { operator: select.getState().value?.[0] },
        )}
        renderValue={(values) =>
          values.map((selectValue) => selectValue.name).join(", ")
        }
      />
      <Select.Popover store={select}>
        {entries(options).map(([value, label]) => (
          <Select.Item value={value} key={value} className={menuItemClasses()}>
            {label.type === "short" ? label.label : `${value} (${label.label})`}
          </Select.Item>
        ))}
      </Select.Popover>
    </Row>
  );
}
