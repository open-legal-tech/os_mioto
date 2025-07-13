"use client";

import { Select } from "@mioto/design-system/Select";
import { SelectWithCombobox } from "@mioto/design-system/SelectWithCombobox";
import { useTranslations } from "@mioto/locale";
import { useEditorVariables } from "../../../../../editor/useEditorVariables";
import type { TNodeId } from "../../../../../tree/id";
import { useTree, useTreeClient } from "../../../../../tree/sync/state";
import {
  type IFileVariable,
  isFileVariable,
} from "../../../../../variables/exports/types";
import { AINode } from "../../exports/plugin";

type Props = {
  nodeId: TNodeId;
  maxSelection?: number;
  id?: string;
};

export function FileSelector({ nodeId, id }: Props) {
  const { treeClient } = useTreeClient();
  const variables = Object.values(
    useEditorVariables({
      filterPrimitives: (variable): variable is IFileVariable =>
        isFileVariable(variable) &&
        (variable.fileType?.includes("pdf") ?? false),
    }),
  );

  const nodeAttachements = useTree(AINode.getSingle(nodeId)).files;
  const t = useTranslations();

  return (
    <SelectWithCombobox
      id={id}
      value={nodeAttachements}
      onSelect={(value) => {
        return AINode.updateAttachements(nodeId, value)(treeClient);
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
      placeholder={t("plugins.node.AI.files.select.placeholder")}
      SelectInput={(props) => (
        <Select.Input className="flex-1 min-w-full" {...props} />
      )}
    />
  );
}
