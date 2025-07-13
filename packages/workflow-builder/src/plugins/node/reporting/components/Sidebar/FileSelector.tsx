"use client";

import { Notification } from "@mioto/design-system/Notification";
import { Select } from "@mioto/design-system/Select";
import { SelectWithCombobox } from "@mioto/design-system/SelectWithCombobox";
import { useTranslations } from "@mioto/locale";
import { useEditorVariables } from "../../../../../editor/useEditorVariables";
import type { TNodeId } from "../../../../../tree/id";
import { useTree, useTreeClient } from "../../../../../tree/sync/state";
import { isFileVariable } from "../../../../../variables/exports/types";
import { ReportingNode } from "../../plugin";

type Props = {
  nodeId: TNodeId;
  maxSelection?: number;
  id?: string;
};

export function FileSelector({ nodeId, id, maxSelection }: Props) {
  const { treeClient } = useTreeClient();
  const variables = Object.values(
    useEditorVariables({ filterPrimitives: isFileVariable }),
  );
  const t = useTranslations();

  const nodeAttachements = useTree(
    ReportingNode.getSingle(nodeId),
  ).attachements;

  return (
    <SelectWithCombobox
      id={id}
      value={nodeAttachements}
      onSelect={(value) => {
        if (value && maxSelection && value.length > maxSelection) {
          return Notification.add({
            Title: t(
              "plugins.node.reporting.attachement.select.max.notification.title",
            ),
            Content: t(
              "plugins.node.reporting.attachement.select.max.notification.content",
              { maxSelection },
            ),
            variant: "warning",
          });
        }

        return ReportingNode.updateAttachements(nodeId, value)(treeClient);
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
      placeholder={t("plugins.node.reporting.files.select.placeholder")}
      SelectInput={(props) => (
        <Select.Input className="flex-1 min-w-full" {...props} />
      )}
    />
  );
}
