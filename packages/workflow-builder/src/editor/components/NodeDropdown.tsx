import { useGetFeatureFlag } from "@mioto/analytics/client";
import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { Stack } from "@mioto/design-system/Stack";
import { textClasses } from "@mioto/design-system/Text/classes";
import { useTranslations } from "@mioto/locale";
import type React from "react";
import { entries } from "remeda";
import { groupBy } from "remeda";
import type {
  INode,
  NodeGroupType,
  NodePlugin,
} from "../../tree/type/plugin/NodePlugin";
import { useTreeClient } from "../exports/state";
import { NodeTypeIcon } from "./NodeTypeIcon";

const sortNodesByGroup = (nodes: NodePlugin[]) => {
  const { data, action, structure, ...options } = groupBy(
    nodes,
    (plugin) => plugin.blockGroup,
  ) as Record<NodeGroupType, NodePlugin[]>;

  return { data, action, structure, ...options };
};

type Props = {
  node?: INode;
  children?: React.ReactNode;
  onSelect: (plugin: NodePlugin) => void;
} & Omit<DropdownMenu.ContentProps, "onSelect">;

export function NodeDropdown({ node, children, onSelect, ...props }: Props) {
  const tNodeNames = useTranslations("common.nodeNames");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {children ?? (
          <DropdownMenu.Button variant="tertiary" className="colorScheme-gray">
            {tNodeNames(`${node?.type}.short` as any)}
          </DropdownMenu.Button>
        )}
      </DropdownMenu.Trigger>
      <NodeDropdownContent onSelect={onSelect} node={node} {...props} />
    </DropdownMenu.Root>
  );
}

type NodeDropdownContentProps = Pick<Props, "onSelect" | "node"> &
  Omit<DropdownMenu.ContentProps, "onSelect">;

export const NodeDropdownContent = ({
  onSelect,
  node,
  ...props
}: NodeDropdownContentProps) => {
  const { nodePlugins } = useTreeClient();
  const getFeatureFlag = useGetFeatureFlag();

  const sortedNodes = sortNodesByGroup(
    Object.values(nodePlugins).filter(
      (nodePlugin) =>
        nodePlugin.type !== node?.type &&
        nodePlugin.isAddable({ getFeatureFlag }),
    ),
  );

  const t = useTranslations();

  return (
    <DropdownMenu.Content
      sideOffset={10}
      align="start"
      aria-label={t("app.editor.canvas.select-block-type")}
      className="min-w-[300px]"
      {...props}
    >
      {entries(sortedNodes).map(([optionGroup, options], index) => {
        const previousOptions = entries(sortedNodes)[index - 1]?.[1];

        return options ? (
          <Stack key={optionGroup}>
            {index > 0 && previousOptions ? (
              <DropdownMenu.Separator className="mb-3" />
            ) : null}
            <DropdownMenu.Label
              className={textClasses({
                size: "small",
                className: "text-gray11",
              })}
            >
              {t(`common.blockGroupNames.${optionGroup}`)}
            </DropdownMenu.Label>
            <Stack className="px-2">
              {options.map((plugin) => {
                return (
                  <DropdownMenu.Item
                    key={plugin.type}
                    onSelect={() => onSelect(plugin)}
                    Icon={<NodeTypeIcon type={plugin.type} />}
                  >
                    {t(`common.nodeNames.${plugin.type}.short` as any)}
                  </DropdownMenu.Item>
                );
              })}
            </Stack>
          </Stack>
        ) : null;
      })}
    </DropdownMenu.Content>
  );
};
