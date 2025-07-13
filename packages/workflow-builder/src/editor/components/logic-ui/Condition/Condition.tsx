import Label from "@mioto/design-system/Label";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { P, match } from "ts-pattern";
import type { Conditions } from "../../../../plugins/edge/complex-logic/exports/plugin";
import { RecordVariable } from "../../../../variables/exports/types";
import { useEditorVariable } from "../../../useEditorVariables";
import { ReadableConditionPopover } from "./ConditionConfigurators/ReadableCondition";
import {
  RecordConfigurator,
  type RecordConfiguratorProps,
} from "./ConditionConfigurators/Record";
import type { ConfiguratorProps } from "./ConditionConfigurators/types";
import { VariableSelector } from "./VariableSelector";

type Props = {
  condition: Conditions;
  className?: string;
} & ConfiguratorProps &
  Pick<
    RecordConfiguratorProps,
    | "onSelectOperatorSelect"
    | "onNumberConditionChange"
    | "onNumberOperatorSelect"
    | "onSelectConditionChange"
    | "onBooleanOperatorSelect"
    | "onMultiSelectConditionChange"
    | "onMultiSelectOperatorSelect"
    | "onTextConditionChange"
    | "onTextOperatorSelect"
    | "onDateConditionChange"
    | "onDateOperatorSelect"
  >;

export function Condition({
  condition,
  className,
  nodeId,
  onVariableSelect,
  onReset,
  ...props
}: Props) {
  const path = condition.variablePath
    ? RecordVariable.splitVariableId(condition.variablePath)
    : undefined;

  const variable = useEditorVariable(path?.recordId);
  const t = useTranslations();

  if (!variable)
    return (
      <ReadableConditionPopover className={className} onReset={onReset}>
        <Stack className="gap-2">
          <Row className="gap-2 items-end">
            <Stack className="flex-1 gap-1">
              <Label>
                {t(
                  "packages.node-editor.logic-configurator.condition.variable-selector.label",
                )}
              </Label>
              <VariableSelector nodeId={nodeId} onSelect={onVariableSelect} />
            </Stack>
          </Row>
        </Stack>
      </ReadableConditionPopover>
    );

  return match([condition, variable])
    .with(
      [
        {
          type: P.union(
            "select",
            "number",
            "boolean",
            "multi-select",
            "text",
            "date",
          ),
        },
        { type: "record" },
      ],
      ([condition, variable]) => (
        <RecordConfigurator
          onReset={onReset}
          className={className}
          condition={condition}
          onVariableSelect={onVariableSelect}
          variable={variable}
          nodeId={nodeId}
          {...props}
        />
      ),
    )
    .otherwise(() => null);
}
