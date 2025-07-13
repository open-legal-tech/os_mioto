import { headingClasses } from "@mioto/design-system/Heading/classes";
import { rowClasses } from "@mioto/design-system/Row";
import { Select } from "@mioto/design-system/Select";
import { useTranslations } from "@mioto/locale";
import type { TNodeId } from "../../../../../tree/id";
import { useTree, useTreeClient } from "../../../../../tree/sync/state";
import { AINode } from "../../exports/plugin";

export function SelectAIType({
  nodeId,
  className,
}: {
  nodeId: TNodeId;
  className?: string;
}) {
  const { treeClient } = useTreeClient();
  const node = useTree(AINode.getSingle(nodeId));
  const t = useTranslations();
  const select = Select.useSelectStore({
    value: node.aiType ?? "extraction",
    setValue: (value) => {
      AINode.updateAIType(nodeId, value as any)(treeClient);
      select.hide();
    },
  });

  return (
    <Select.Root
      store={select}
      options={[
        {
          id: "extraction",
          name: t("plugins.node.AI.select-ai-type.extraction.label"),
          type: "option",
          data: {},
        },
        {
          id: "decision",
          name: t("plugins.node.AI.select-ai-type.decision.label"),
          type: "option",
          data: {},
        },
      ]}
    >
      <div className={rowClasses({}, ["justify-between", className])}>
        <Select.Label className={headingClasses({ size: "tiny" })}>
          {t("plugins.node.AI.select-ai-type.label")}
        </Select.Label>
        <Select.Input />
        <Select.Content />
      </div>
    </Select.Root>
  );
}

// const CalculationTypesHelpTooltip = () => {
//   const t = useTranslations();

//   return (
//     <HelpTooltip className={stackClasses({}, "gap-3")}>
//       <Stack className="gap-1">
//         <Heading size="extra-small">
//           {t("plugins.node.calculation.help-tooltip.numbers.heading")}
//         </Heading>
//         <Text className="text-gray9">
//           {t("plugins.node.calculation.help-tooltip.numbers.content")}
//         </Text>
//       </Stack>
//       <Stack className="gap-1">
//         <Heading size="extra-small">
//           {t("plugins.node.calculation.help-tooltip.date.heading")}
//         </Heading>
//         <Text className="text-gray9">
//           {t("plugins.node.calculation.help-tooltip.date.content")}
//         </Text>
//       </Stack>
//       <Stack className="gap-1">
//         <Heading size="extra-small">
//           {t("plugins.node.calculation.help-tooltip.date-difference.heading")}
//         </Heading>
//         <Text className="text-gray9">
//           {t("plugins.node.calculation.help-tooltip.date-difference.content")}
//         </Text>
//       </Stack>
//     </HelpTooltip>
//   );
// };
