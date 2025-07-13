import { Accordion } from "@mioto/design-system/Accordion";
import Badge from "@mioto/design-system/Badge";
import {
  sidebarCardBottomClasses,
  sidebarCardClasses,
} from "@mioto/design-system/Card";
import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { Heading } from "@mioto/design-system/Heading";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { IconButton } from "@mioto/design-system/IconButton";
import { InfoBox } from "@mioto/design-system/InfoBox";
import { Row } from "@mioto/design-system/Row";
import { Stack, stackClasses } from "@mioto/design-system/Stack";
import { FallbackEdge } from "@mioto/icons/FallbackEdge";
import { useTranslations } from "@mioto/locale";
import { ArrowsDownUp, X } from "@phosphor-icons/react/dist/ssr";
import { Reorder } from "framer-motion";
import * as React from "react";
import { ComplexLogicEdge } from "../../../plugins/edge/complex-logic/exports/plugin";
import type { TEdgeId } from "../../../tree/id";
import { useTree, useTreeClient } from "../../../tree/sync/state";
import type { INode } from "../../../tree/type/plugin/NodePlugin";
import { useSidebarContext } from "../NodeSidebar";
import { sidebarButtonProps } from "../sidebarButtonProps";
import { CreateConnectionButton } from "./CreateConnectionButton";
import { LogicAccordionItem } from "./LogicAccordionItem";
import {
  EdgeCardTitle,
  EdgeMenu,
  LogicAccordionTrigger,
  edgeCardContainerClasses,
} from "./LogicAccordionTrigger";

export function LogicConfigurator() {
  const selectedNodeId = useSidebarContext();
  const nodeOptions = useTree((treeClient) =>
    Object.values(
      treeClient.nodes.get.options(selectedNodeId, "Ohne Name"),
    ).map((name) => (({
      ...name,
      type: "option"
    }) as const)),
  );

  const nodeNames = useTree((treeClient) =>
    Object.values(treeClient.nodes.get.names()).map(
      (value) =>
        (({
          ...value,
          type: "option"
        }) as const),
    ),
  );

  const node = useTree((treeClient) =>
    treeClient.nodes.get.single(selectedNodeId),
  );

  const id = React.useId();

  const [isReordering, setIsReordering] = React.useState(false);

  const t = useTranslations();

  return (
    <>
      {node.final ? (
        <InfoBox
          variant="info"
          Title={t(
            "packages.node-editor.logic-configurator.final-block.info.title",
          )}
          Content={t(
            "packages.node-editor.logic-configurator.final-block.info.content",
          )}
          className="m-4"
        />
      ) : null}
      <Stack className={node.final ? "opacity-50 pointer-events-none" : ""}>
        <Row className="items-center justify-between m-4 mb-2">
          <Row className="gap-2">
            <Heading size="extra-small" className="flex-1" id={id}>
              {t("packages.node-editor.logic-configurator.title")}
            </Heading>
            <HelpTooltip>
              {t(
                "packages.node-editor.logic-configurator.help-tooltip.content",
              )}
            </HelpTooltip>
          </Row>
          <Row className="gap-1 items-center">
            {isReordering ? (
              <IconButton
                {...sidebarButtonProps}
                tooltip={{
                  children: t(
                    "packages.node-editor.logic-configurator.reorder.stop.tooltip",
                  ),
                }}
                onClick={() => {
                  setIsReordering(false);
                }}
                variant="tertiary"
              >
                <X />
              </IconButton>
            ) : (
              <IconButton
                {...sidebarButtonProps}
                tooltip={{
                  children: t(
                    "packages.node-editor.logic-configurator.reorder.start.tooltip",
                  ),
                }}
                onClick={() => {
                  setIsReordering(true);
                }}
                variant="tertiary"
              >
                <ArrowsDownUp />
              </IconButton>
            )}
            <CreateConnectionButton
              options={nodeOptions}
              allOptions={nodeNames}
              nodeId={selectedNodeId}
            />
          </Row>
        </Row>
        <Accordion.Root
          type="multiple"
          className={stackClasses({}, "my-0 mx-4 gap-2")}
          value={isReordering ? [] : node.edges}
          aria-label={t(
            "packages.node-editor.logic-configurator.list.aria-label",
          )}
          role="list"
          asChild
        >
          <ConditionItems node={node} id={id} isReordering={isReordering} />
        </Accordion.Root>
      </Stack>
    </>
  );
}

function ConditionItems({
  node,
  isReordering,
  id,
}: {
  node: INode;
  isReordering: boolean;
  id: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { treeClient } = useTreeClient();

  if (
    (node.edges.length === 1 && !node.fallbackEdge) ||
    (node.edges.length === 0 && node.fallbackEdge)
  ) {
    const edgeId = node.edges[0] ?? node.fallbackEdge;

    if (!edgeId) {
      throw new Error("No edge found");
    }

    return (
      <ul className={stackClasses({}, "gap-2 pl-0 mx-4")}>
        <DirectEdgeCard edgeId={edgeId} />
      </ul>
    );
  }

  if (isReordering) {
    return (
      <Reorder.Group
        values={node.edges}
        onReorder={(newOrder) =>
          treeClient.nodes.update.edges.reorder(node.id, newOrder)
        }
        ref={ref}
        axis="y"
        className="gap-2 list-none p-0 grid mx-4"
        aria-labelledby={id}
      >
        {node.edges.map((edgeId) => (
          <Reorder.Item
            value={edgeId}
            dragConstraints={ref}
            className="m-0 reorder-item"
            key={edgeId}
          >
            <Item edgeId={edgeId} isReordering={isReordering} />
          </Reorder.Item>
        ))}
        {node.fallbackEdge ? (
          <Item
            key={node.fallbackEdge}
            edgeId={node.fallbackEdge}
            isDirect
            className="opacity-50"
          />
        ) : null}
      </Reorder.Group>
    );
  }

  return (
    <ul className={stackClasses({}, "gap-2 pl-0 mx-4")}>
      {node.edges.map((edgeId) => (
        <Item key={edgeId} edgeId={edgeId} />
      ))}
      {node.fallbackEdge ? (
        <FallbackEdgeCard edgeId={node.fallbackEdge} />
      ) : null}
    </ul>
  );
}

type ItemProps = {
  edgeId: TEdgeId;
  isDirect?: boolean;
  className?: string;
  isReordering?: boolean;
};

function Item({ edgeId, isDirect, isReordering, className }: ItemProps) {
  return (
    <AccordionItem
      edgeId={edgeId}
      isReordering={isReordering}
      isDirect={isDirect}
      className={className}
    />
  );
}

type AccordionItemProps = Pick<
  ItemProps,
  "isReordering" | "edgeId" | "isDirect"
> & { className?: string };

const AccordionItem = ({
  isReordering,
  edgeId,
  isDirect,
  className,
}: AccordionItemProps) => {
  const selectedNodeId = useSidebarContext();

  return (
    <Accordion.Item
      value={edgeId}
      className={sidebarCardClasses(className)}
      role="listitem"
      aria-labelledby={`logic-card-name_${edgeId}`}
    >
      <LogicAccordionTrigger
        edgeId={edgeId}
        isReordering={isReordering}
        isDirect={isDirect}
        nodeId={selectedNodeId}
      />
      <LogicAccordionItem
        className={sidebarCardBottomClasses()}
        edgeId={edgeId}
        nodeId={selectedNodeId}
        isDirect={isDirect}
      />
    </Accordion.Item>
  );
};

type DirectEdgeCardProps = {
  edgeId: TEdgeId;
};

const DirectEdgeCard = ({ edgeId }: DirectEdgeCardProps) => {
  const selectedNodeId = useSidebarContext();
  const t = useTranslations();

  return (
    <div className={sidebarCardClasses(edgeCardContainerClasses)}>
      <EdgeCardTitle edgeId={edgeId}>
        <Row className="gap-1 items-center">
          <Badge
            colorScheme="gray"
            tooltip={{
              children: t(
                "packages.node-editor.logic-configurator.list.direct-edge.badge.tooltip",
              ),
            }}
          >
            {t(
              "packages.node-editor.logic-configurator.list.direct-edge.badge.title",
            )}
          </Badge>
          <EdgeMenu
            edgeId={edgeId}
            nodeId={selectedNodeId}
            onEdgeCreate={({ source, target }) =>
              (treeClient) =>
                ComplexLogicEdge.create({
                  source,
                  target,
                })(treeClient)
              }
          />
        </Row>
      </EdgeCardTitle>
    </div>
  );
};

type FallbackEdgeCardProps = {
  edgeId: TEdgeId;
};

const FallbackEdgeCard = ({ edgeId }: FallbackEdgeCardProps) => {
  const selectedNodeId = useSidebarContext();
  const edge = useTree((treeClient) => treeClient.edges.get.single(edgeId));
  const { treeClient } = useTreeClient();
  const t = useTranslations();

  return (
    <div className={sidebarCardClasses(edgeCardContainerClasses)}>
      <EdgeCardTitle edgeId={edgeId}>
        <Row className="items-center gap-1">
          <Badge
            colorScheme="gray"
            tooltip={{
              children: t(
                "packages.node-editor.logic-configurator.list.fallback-edge.tooltip",
              ),
            }}
          >
            {t(
              "packages.node-editor.logic-configurator.list.fallback-edge.title",
            )}
          </Badge>
          <EdgeMenu
            edgeId={edgeId}
            nodeId={selectedNodeId}
            onEdgeCreate={({ source, target }) =>
              (treeClient) =>
                ComplexLogicEdge.create({
                  source,
                  target,
                })(treeClient)
              }
          >
            <DropdownMenu.Item
              onClick={() => {
                treeClient.nodes.update.removeFallbackEdge(edge.source);
              }}
              Icon={<FallbackEdge />}
            >
              {t(
                "packages.node-editor.logic-configurator.list.fallback-edge.menu.remove",
              )}
            </DropdownMenu.Item>
          </EdgeMenu>
        </Row>
      </EdgeCardTitle>
    </div>
  );
};
