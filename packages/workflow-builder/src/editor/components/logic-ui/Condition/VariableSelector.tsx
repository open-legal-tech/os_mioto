import Badge from "@mioto/design-system/Badge";
import { Combobox } from "@mioto/design-system/Combobox";
import { Row } from "@mioto/design-system/Row";
import { Select } from "@mioto/design-system/Select";
import {
  SelectWithCombobox,
  type SubOption,
} from "@mioto/design-system/SelectWithCombobox";
import type { GroupOption } from "@mioto/design-system/classes/options";
import { useTranslations } from "@mioto/locale";
import { isDefined } from "remeda";
import { match } from "ts-pattern";
import type { TChildId, TMainChildId, TNodeId } from "../../../../tree/id";
import { useTreeClient } from "../../../../tree/sync/state";
import { RecordVariable } from "../../../../variables/exports/types";
import { useEditorVariables } from "../../../useEditorVariables";
import { NodeTypeIcon, VariableTypeIcon } from "../../NodeTypeIcon";

export type VariableSelectorProps = {
  nodeId?: TNodeId;
  onSelect: (id: TNodeId | TChildId | TMainChildId) => void;
  value?: TNodeId | TChildId | TMainChildId;
  id?: string;
};

export function VariableSelector({
  onSelect,
  value,
  nodeId,
  id,
}: VariableSelectorProps) {
  const t = useTranslations();
  const { treeClient } = useTreeClient();

  const selectableVariables = Object.values(
    useEditorVariables({ includeEmptyRecords: true }),
  )
    .map((variable) => {
      return match(variable)
        .when(
          RecordVariable.is,
          (variable) =>
            ({
              data: { type: variable.type },
              id: variable.id,
              type: "group-option",
              isSelectable: !variable.system,
              name: variable.name,
              subOptions: Object.values(variable.value)
                .filter(
                  (childVariable) =>
                    childVariable.type === "multi-select" ||
                    childVariable.type === "select" ||
                    childVariable.type === "number" ||
                    childVariable.type === "boolean" ||
                    childVariable.type === "text" ||
                    childVariable.type === "email" ||
                    childVariable.type === "date",
                )
                .map(
                  (childVariable) =>
                    ({
                      id: childVariable.id,
                      name: childVariable.name,
                      groupName: variable.name,
                      groupId: variable.id,
                      data: {
                        type: childVariable.type,
                      },
                      type: "sub-option",
                    }) satisfies SubOption,
                ),
            }) satisfies GroupOption,
        )
        .otherwise(() => undefined);
    })
    .filter(isDefined);

  return (
    <SelectWithCombobox
      promoteOptionId={nodeId}
      value={value}
      options={selectableVariables}
      id={id}
      ComboboxInput={(props) => (
        <Combobox.Input
          autoFocus
          {...props}
          placeholder={t(
            "packages.node-editor.logic-configurator.condition.variable-selector.combobox.input.placeholder",
          )}
        />
      )}
      onSelect={(value) => {
        if (!value) return;

        return onSelect(value);
      }}
      SelectInput={({ store, ...props }) => {
        return (
          <Select.Input
            store={store}
            placeholder={t(
              "packages.node-editor.logic-configurator.condition.variable-selector.placeholder",
            )}
            maxValueLength={45}
            aria-label={t(
              "packages.node-editor.logic-configurator.condition.variable-selector.placeholder",
            )}
            {...props}
          />
        );
      }}
      comboboxListProps={{
        "aria-label": t(
          "packages.node-editor.logic-configurator.condition.variable-selector.combobox.list.aria-label",
        ),
        GroupLabel: ({ id, isPromoted, name, store, isSelectable }) => {
          const node = treeClient.nodes.get.single(id as TNodeId);

          const Content = (
            <Row className="gap-2 items-center">
              {name}
              {isPromoted ? (
                <Badge className="font-weak min-w-max">
                  {t(
                    "packages.node-editor.logic-configurator.condition.variable-selector.this-block.badge",
                  )}
                </Badge>
              ) : null}
            </Row>
          );

          return (
            <Combobox.GroupLabel className="items-center mx-2 flex-1">
              {isSelectable ? (
                <Select.Item
                  value={id}
                  store={store}
                  className="px-2 m-0 flex-1"
                  Icon={<NodeTypeIcon type={node.type} />}
                >
                  {Content}
                </Select.Item>
              ) : (
                <Select.NonInteractiveItem className="px-2 m-0 flex-1">
                  {Content}
                </Select.NonInteractiveItem>
              )}
            </Combobox.GroupLabel>
          );
        },
      }}
      valueCombinator=" → "
      renderItem={({ item }) => (
        <Row className="gap-2 flex-1 items-center font-none">
          {item.data?.type ? <VariableTypeIcon type={item.data.type} /> : null}
          {item.name}
        </Row>
      )}
    />
  );
}
