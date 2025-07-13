"use client";

import { Select } from "@mioto/design-system/Select";
import { SelectWithCombobox } from "@mioto/design-system/SelectWithCombobox";
import { useTranslations } from "@mioto/locale";
import { useEditorVariables } from "../../../../../editor/useEditorVariables";
import type { TChildId, TMainChildId, TNodeId } from "../../../../../tree/id";
import { useTree, useTreeClient } from "../../../../../tree/sync/state";
import {
  type IFileVariable,
  isFileVariable, isPrimitiveVariable, type PrimitiveVariable, RecordVariable
} from "../../../../../variables/exports/types";
import { ReportingNode } from "../../plugin";

type Props = {
  nodeId: TNodeId;
  id?: string;
  value?: TMainChildId| TChildId;
};

export function EmailVariableSelector({ nodeId, value, id }: Props) {
  const { treeClient } = useTreeClient();
  const variables = Object.values(
    useEditorVariables({
      filterPrimitives: (variable): variable is PrimitiveVariable =>
        isPrimitiveVariable(variable) &&
        (variable.type === "email"),
    }),
  );

  const t = useTranslations();

  return (
    <SelectWithCombobox
      id={id}
      value={value} // pass the currently selected value
      onSelect={(value) => {

        return ReportingNode.updateVariableRecipient(nodeId, value)(treeClient);

      }}
      options={variables.map((variable) => ({
        type: "group-option",
        name: variable.name,
        id: variable.id,
        data: {},
        isSelectable: false,
        subOptions: Object.values(variable.value).map((value) => ({
          name: value.name,
          id: value.id,
          parentId: variable.id,
          data: {},
          type: "sub-option",
          groupId: variable.id,
          groupName: variable.name,
        })),
      }))}
      renderValue={(values) => values.map((value) => value.name).join(", ")}
      placeholder={t('plugins.node.reporting.recipient.select-email-variable')}
      SelectInput={(props) => (
        <Select.Input className="flex-1 min-w-full" {...props} />
      )}
    />
  );
}
