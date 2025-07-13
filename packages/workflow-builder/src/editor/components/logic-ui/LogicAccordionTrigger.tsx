import Badge from "@mioto/design-system/Badge";
import { Button } from "@mioto/design-system/Button";
import { Combobox } from "@mioto/design-system/Combobox";
import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { Row, rowClasses } from "@mioto/design-system/Row";
import { menuItemClasses } from "@mioto/design-system/classes/menuClasses";
import { Failure } from "@mioto/errors";
import { FallbackEdge } from "@mioto/icons/FallbackEdge";
import { useTranslations } from "@mioto/locale";
import {
  ArrowSquareOut,
  DotsThree,
  Target,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { pick } from "remeda";
import { ComplexLogicEdge } from "../../../plugins/edge/complex-logic/exports/plugin";
import { type TEdgeId, type TNodeId, ZNodeId } from "../../../tree/id";
import { useTree, useTreeClient } from "../../../tree/sync/state";
import type { IEdge } from "../../../tree/type/plugin/EdgePlugin";
import { useEditor } from "../../useEditor";
import { NodeDropdownContent } from "../NodeDropdown";
import { NodeTypeIcon } from "../NodeTypeIcon";
import type { ExtractFailure, onEdgeCreate } from "../TargetSelector";

type EdgeCardTitleProps = {
  edgeId: TEdgeId;
  children?: React.ReactNode;
};

export const EdgeCardTitle = ({ edgeId, children }: EdgeCardTitleProps) => {
  const edge = useTree((treeClient) => treeClient.edges.get.single(edgeId));
  const targetNode = useTree((treeClient) => {
    return edge.target ? treeClient.nodes.get.single(edge.target) : undefined;
  });

  const t = useTranslations();

  return (
    <Row
      className="justify-between font-weak flex-1 items-center"
      id={`logic-card-name_${edgeId}`}
    >
      {targetNode ? (
        <Row className="gap-2 text-start items-center">
          <NodeTypeIcon type={targetNode.type} />
          {targetNode.name}
        </Row>
      ) : (
        <i>
          {t(
            "packages.node-editor.logic-configurator.list.card.title-fallback",
          )}
        </i>
      )}
      {children}
    </Row>
  );
};

export const edgeCardContainerClasses = rowClasses({}, [
  "p-2 pl-4 items-center gap-1",
]);

export type LogicAccordionTriggerProps = {
  edgeId: TEdgeId;
  nodeId: TNodeId;
  isReordering?: boolean;
  isDirect?: boolean;
};

export function LogicAccordionTrigger({
  edgeId,
  isReordering = false,
  nodeId,
}: LogicAccordionTriggerProps) {
  const { treeClient } = useTreeClient();
  const edge = useTree((treeClient) => treeClient.edges.get.single(edgeId));
  const t = useTranslations();

  return (
    <Row className={edgeCardContainerClasses}>
      <EdgeCardTitle edgeId={edgeId} />
      <EdgeMenu
        edgeId={edgeId}
        disabled={isReordering}
        nodeId={nodeId}
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
            treeClient.nodes.update.fallbackEdge(edge.source, edge.id);
          }}
          Icon={<FallbackEdge />}
        >
          {t(
            "packages.node-editor.logic-configurator.list.menu.make-fallback-edge.title",
          )}

          <HelpTooltip>
            {t(
              "packages.node-editor.logic-configurator.list.menu.make-fallback-edge.help-tooltip.content",
            )}
          </HelpTooltip>
        </DropdownMenu.Item>
      </EdgeMenu>
    </Row>
  );
}

type MenuProps = {
  edgeId: TEdgeId;
  disabled?: boolean;
  children?: React.ReactNode;
  nodeId: TNodeId;
} & TargetSelecttorCombobox;

export const EdgeMenu = ({
  edgeId,
  disabled,
  children,
  nodeId,
  onEdgeCreate,
  onFailure,
}: MenuProps) => {
  const edge = useTree((treeClient) => treeClient.edges.get.single(edgeId));
  const { treeClient } = useTreeClient();
  const { replaceSelectedNodes } = useEditor();

  const target = edge.target;

  const [isOpen, setIsOpen] = React.useState(false);
  const t = useTranslations();

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Button
        variant="tertiary"
        square
        disabled={disabled}
        withCaret={false}
      >
        <DotsThree weight="bold" />
      </DropdownMenu.Button>
      <DropdownMenu.Content align="end" sideOffset={5}>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTriggerItem>
            <Target />
            {t(
              "packages.node-editor.logic-configurator.list.menu.target-selector.label",
            )}
          </DropdownMenu.SubTriggerItem>
          <DropdownMenu.SubContent alignOffset={-10} sideOffset={10}>
            <TargetSelectorCombobox
              nodeId={nodeId}
              onEdgeCreate={onEdgeCreate}
              edge={edge}
              onFailure={onFailure}
              onTargetUpdate={() => {
                setIsOpen(false);
              }}
            />
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        {target ? (
          <DropdownMenu.Item
            onClick={() => replaceSelectedNodes([target])}
            Icon={<ArrowSquareOut />}
          >
            {t(
              "packages.node-editor.logic-configurator.list.menu.select-target",
            )}
          </DropdownMenu.Item>
        ) : null}
        {children}
        <DropdownMenu.Item
          onClick={() => treeClient.edges.delete([edge.id])}
          Icon={<Trash />}
        >
          {t("packages.node-editor.logic-configurator.list.menu.remove")}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

type TargetSelecttorCombobox<
  TFailure extends Failure = Failure,
  TOnEdgeCreate extends onEdgeCreate<TFailure> = onEdgeCreate<TFailure>,
> = {
  nodeId: TNodeId;
  edge?: IEdge;
  onEdgeCreate: TOnEdgeCreate;
  onTargetUpdate?: (newTarget?: string) => void;
  onFailure?: (failure: ExtractFailure<TOnEdgeCreate>) => void;
};

const TargetSelectorCombobox = <
  TFailure extends Failure = Failure,
  TOnEdgeCreate extends onEdgeCreate<TFailure> = onEdgeCreate<TFailure>,
>({
  nodeId,
  onEdgeCreate,
  onFailure,
  edge,
  onTargetUpdate,
}: TargetSelecttorCombobox<TFailure, TOnEdgeCreate>) => {
  const combobox = Combobox.useComboboxStore({
    resetValueOnHide: true,
    defaultOpen: true,
  });

  const nodeNames = useTree((treeClient) =>
    Object.values(treeClient.nodes.get.options(nodeId, "Ohne Name")).map(
      (name) =>
        ({
          ...name,
          type: "option",
        }) as const,
    ),
  );
  const { treeClient } = useTreeClient();

  const node = useTree((treeClient) => treeClient.nodes.get.single(nodeId));

  const t = useTranslations();

  return (
    <>
      <Combobox.Input store={combobox} className="mx-2 mt-2" />
      <Combobox.List
        options={nodeNames}
        store={combobox}
        className="w-[400px] max-h-[400px]"
        CreateItem={({ value, store }) => {
          return (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button
                  className={menuItemClasses(
                    "justify-between mt-2 mb-1 font-weak",
                  )}
                >
                  {value}
                  <Badge>
                    {t(
                      "packages.node-editor.logic-configurator.list.menu.target-selector.create-item.badge",
                    )}
                  </Badge>
                </Button>
              </DropdownMenu.Trigger>
              <NodeDropdownContent
                align="start"
                sideOffset={10}
                onSelect={(plugin) => {
                  const childNode = treeClient.nodes.create.childNode(
                    nodeId,
                    plugin.create({ name: value })(treeClient),
                  );

                  if (!childNode) return;

                  const newEdge = onEdgeCreate({
                    source: nodeId,
                    target: childNode.id,
                  })(treeClient);

                  if (newEdge instanceof Failure) {
                    return onFailure?.(
                      newEdge as ExtractFailure<TOnEdgeCreate>,
                    );
                  }

                  if (!edge) {
                    treeClient.edges.add(newEdge);
                  } else {
                    treeClient.edges.update(
                      edge.id,
                      pick(newEdge, ["source", "target"]),
                    );
                  }

                  treeClient.nodes.add(childNode);
                  store.hide();
                  return onTargetUpdate?.();
                }}
                node={node}
              />
            </DropdownMenu.Root>
          );
        }}
        Item={({ item }) => (
          <Combobox.Item
            render={({ onSelect: _, ...props }) => (
              <DropdownMenu.Item
                key={item.id}
                onSelect={() => {
                  const parsedTarget = ZNodeId.safeParse(item.id);

                  if (!parsedTarget.success) return;

                  const newEdge = onEdgeCreate({
                    source: nodeId,
                    target: parsedTarget.data,
                  })(treeClient);

                  if (newEdge instanceof Failure) {
                    // This typecast is necessary to tell Typescript, that we are sure about the specific type
                    // of Failure here.
                    return onFailure?.(
                      newEdge as ExtractFailure<TOnEdgeCreate>,
                    );
                  }

                  if (!edge) {
                    treeClient.edges.add(newEdge);
                  } else {
                    treeClient.edges.update(
                      edge.id,
                      pick(newEdge, ["source", "target"]),
                    );
                  }

                  combobox.hide();

                  return onTargetUpdate?.(item.id);
                }}
                className={menuItemClasses()}
                {...props}
                Icon={item.data ? <NodeTypeIcon type={item.data.type} /> : null}
              >
                {item.name}
              </DropdownMenu.Item>
            )}
          />
        )}
      />
    </>
  );
};
