import { headingClasses } from "@mioto/design-system/Heading/classes";
import { rowClasses } from "@mioto/design-system/Row";
import { Select } from "@mioto/design-system/Select";
import { useTranslations } from "@mioto/locale";
import type { TNodeId } from "../../../../../tree/id";
import { useTree, useTreeClient } from "../../../../../tree/sync/state";
import { ReportingNode } from "../../plugin";

export function SelectReceivingEmail({
  nodeId,
  className,
}: {
  nodeId: TNodeId;
  className?: string;
}) {
  const { treeClient } = useTreeClient();
  const node = useTree(ReportingNode.getSingle(nodeId));
  const t = useTranslations();
  const select = Select.useSelectStore({
    value: node.variant.type,
    setValue: (value) => {
      ReportingNode.updateEmailType(nodeId, value as any)(treeClient);
      select.hide();
    },
  });

  return (
    <Select.Root
      store={select}
      options={[
        {
          id: "default",
          name: t("plugins.node.reporting.recipient.send-to-admin"),
          type: "option",
          data: {},
        },
        {
          id: "variable",
          name: t("plugins.node.reporting.recipient.email-from-variable"),
          type: "option",
          data: {},
        },
        {
          id: "custom",
          name: t("plugins.node.reporting.recipient.enter-custom"),
          type: "option",
          data: {},
        },
      ]}
    >
      <div className={rowClasses({}, ["justify-between", className])}>
        <Select.Label className={headingClasses({ size: "tiny" })}>
          {t("plugins.node.reporting.recipient.label")}
        </Select.Label>
        <Select.Input />
        <Select.Content />
      </div>
    </Select.Root>
  );
}

