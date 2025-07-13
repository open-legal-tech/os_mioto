import Heading from "@mioto/design-system/Heading";
import { headingClasses } from "@mioto/design-system/Heading/classes";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { Row, rowClasses } from "@mioto/design-system/Row";
import { Select } from "@mioto/design-system/Select";
import { Stack, stackClasses } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import type { TNodeId } from "../../../../../tree/id";
import { useTree, useTreeClient } from "../../../../../tree/sync/state";
import { CalculationNode } from "../../plugin";

export function SelectCalulationType({
  nodeId,
  className,
}: {
  nodeId: TNodeId;
  className?: string;
}) {
  const { treeClient } = useTreeClient();
  const node = useTree(CalculationNode.getSingle(nodeId));
  const t = useTranslations();
  const select = Select.useSelectStore({
    value: node.calculationType,
    setValue: (value) => {
      CalculationNode.updateCalculationType(nodeId, value as any)(treeClient);
      select.hide();
    },
  });

  return (
    <Select.Root
      store={select}
      options={[
        {
          id: "number",
          name: t("plugins.node.calculation.output.number"),
          type: "option",
          data: {},
        },
        {
          id: "date",
          name: t("plugins.node.calculation.output.date"),
          type: "option",
          data: {},
        },
        {
          id: "date-difference",
          name: t("plugins.node.calculation.output.date-difference"),
          type: "option",
          data: {},
        },
      ]}
    >
      <div className={rowClasses({}, ["justify-between", className])}>
        <Select.Label className={headingClasses({ size: "tiny" })}>
          {t("plugins.node.calculation.output.label")}
        </Select.Label>
        <Row className="gap-2">
          <CalculationTypesHelpTooltip />
          <Select.Input />
        </Row>
        <Select.Content />
      </div>
    </Select.Root>
  );
}

const CalculationTypesHelpTooltip = () => {
  const t = useTranslations();

  return (
    <HelpTooltip className={stackClasses({}, "gap-3")}>
      <Stack className="gap-1">
        <Heading size="extra-small">
          {t("plugins.node.calculation.help-tooltip.numbers.heading")}
        </Heading>
        <Text className="text-gray9">
          {t("plugins.node.calculation.help-tooltip.numbers.content")}
        </Text>
      </Stack>
      <Stack className="gap-1">
        <Heading size="extra-small">
          {t("plugins.node.calculation.help-tooltip.date.heading")}
        </Heading>
        <Text className="text-gray9">
          {t("plugins.node.calculation.help-tooltip.date.content")}
        </Text>
      </Stack>
      <Stack className="gap-1">
        <Heading size="extra-small">
          {t("plugins.node.calculation.help-tooltip.date-difference.heading")}
        </Heading>
        <Text className="text-gray9">
          {t("plugins.node.calculation.help-tooltip.date-difference.content")}
        </Text>
      </Stack>
    </HelpTooltip>
  );
};
