import { Accordion } from "@mioto/design-system/Accordion";
import { Button } from "@mioto/design-system/Button";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { IconButton } from "@mioto/design-system/IconButton";
import Label from "@mioto/design-system/Label";
import { Popover } from "@mioto/design-system/Popover";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import { ToggleGroup } from "@mioto/design-system/ToggleGroup";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import { useTranslations } from "@mioto/locale";
import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { ComplexLogicEdge } from "../../../plugins/edge/complex-logic/exports/plugin";
import type { TEdgeId, TNodeId } from "../../../tree/id";
import { useTree, useTreeClient } from "../../../tree/sync/state";
import { Condition } from "./Condition/Condition";

type Props = {
  edgeId: TEdgeId;
  className?: string;
  nodeId: TNodeId;
  isDirect?: boolean;
};

export function LogicAccordionItem({
  edgeId,
  className,
  nodeId,
  isDirect,
}: Props) {
  const edge = useTree(ComplexLogicEdge.getSingle(edgeId));

  const { treeClient } = useTreeClient();
  const t = useTranslations();

  return (
    <Accordion.Content className={className}>
      {isDirect ? (
        <div className="py-2" />
      ) : (
        <>
          <Row className={"justify-between items-center py-2 px-4 pb-1"}>
            <Row className="gap-2">
              <Label className="flex-1">
                {t(
                  "packages.node-editor.logic-configurator.list.card.conditions.title.text",
                )}
              </Label>
              <HelpTooltip>
                {t(
                  "packages.node-editor.logic-configurator.list.card.conditions.title.help-tooltip.content",
                )}
              </HelpTooltip>
            </Row>
            <Button
              variant="secondary"
              size="small"
              onClick={() => ComplexLogicEdge.addCondition(edgeId)(treeClient)}
            >
              <Plus />
              {t(
                "packages.node-editor.logic-configurator.list.card.conditions.add-button",
              )}
            </Button>
          </Row>
          <Stack className={"gap-2 px-4 pb-3 pt-1"}>
            <Stack className="gap-2">
              {edge.conditions?.map(([condition, chain], index) => (
                <Stack key={condition.id} className="gap-2">
                  <Popover.Root>
                    <div
                      className={twMerge([
                        "gap-2 grid",
                        edge.conditions.length > 1
                          ? "grid-cols-[1fr_39px]"
                          : "grid-cols-1",
                      ])}
                    >
                      <Condition
                        nodeId={nodeId}
                        condition={condition}
                        onVariableSelect={(id) => {
                          ComplexLogicEdge.updateConditionVariablePath(
                            edge.id,
                            index,
                            id,
                          )(treeClient);
                        }}
                        onSelectOperatorSelect={(operator) =>
                          ComplexLogicEdge.conditions.select.updateOperator(
                            edge.id,
                            index,
                            operator,
                          )(treeClient)
                        }
                        onMultiSelectOperatorSelect={(operator) =>
                          ComplexLogicEdge.conditions[
                            "multi-select"
                          ].updateOperator(
                            edge.id,
                            index,
                            operator,
                          )(treeClient)
                        }
                        onNumberOperatorSelect={(operator) =>
                          ComplexLogicEdge.conditions.number.updateOperator(
                            edge.id,
                            index,
                            operator,
                          )(treeClient)
                        }
                        onTextOperatorSelect={(operator) =>
                          ComplexLogicEdge.conditions.text.updateOperator(
                            edge.id,
                            index,
                            operator,
                          )(treeClient)
                        }
                        onSelectConditionChange={(value) => {
                          if (condition.type !== "select") return;

                          return ComplexLogicEdge.conditions.select.updateComparator(
                            edge.id,
                            index,
                            Array.isArray(value) ? value : [value],
                          )(treeClient);
                        }}
                        onNumberConditionChange={(value) => {
                          return ComplexLogicEdge.conditions.number.updateComparator(
                            edge.id,
                            index,
                            value,
                          )(treeClient);
                        }}
                        onBooleanOperatorSelect={(value) =>
                          ComplexLogicEdge.conditions.boolean.updateOperator(
                            edge.id,
                            index,
                            value,
                          )(treeClient)
                        }
                        onTextConditionChange={(value) => {
                          return ComplexLogicEdge.conditions.text.updateComparator(
                            edge.id,
                            index,
                            value,
                          )(treeClient);
                        }}
                        onMultiSelectConditionChange={(value) => {
                          if (condition.type !== "multi-select") return;

                          return ComplexLogicEdge.conditions[
                            "multi-select"
                          ].updateComparator(
                            edge.id,
                            index,
                            Array.isArray(value) ? value : [value],
                          )(treeClient);
                        }}
                        onDateConditionChange={(value) => {
                          return ComplexLogicEdge.conditions.date.updateComparator(
                            edge.id,
                            index,
                            value,
                          )(treeClient);
                        }}
                        onDateOperatorSelect={(value) =>
                          ComplexLogicEdge.conditions.date.updateOperator(
                            edge.id,
                            index,
                            value,
                          )(treeClient)
                        }
                        onReset={() =>
                          ComplexLogicEdge.resetCondition(
                            edge.id,
                            index,
                          )(treeClient)
                        }
                      />
                      {edge.conditions.length > 1 ? (
                        <IconButton
                          tooltip={{
                            children: t(
                              "packages.node-editor.logic-configurator.list.card.conditions.remove",
                            ),
                          }}
                          variant="tertiary"
                          onClick={() =>
                            ComplexLogicEdge.removeCondition(
                              edge.id,
                              index,
                            )(treeClient)
                          }
                        >
                          <Trash />
                        </IconButton>
                      ) : null}
                      {chain !== "none" ? (
                        <>
                          <ToggleGroup.Root
                            type="single"
                            value={chain}
                            onValueChange={(value: "and" | "or") => {
                              if (value.length > 0) {
                                return ComplexLogicEdge.updateChain(
                                  edgeId,
                                  index,
                                  value,
                                )(treeClient);
                              }
                            }}
                          >
                            <ToggleGroup.Item value="and">
                              {t(
                                "packages.node-editor.logic-configurator.list.card.conditions.chain.and",
                              )}
                            </ToggleGroup.Item>
                            <ToggleGroup.Item value="or">
                              {t(
                                "packages.node-editor.logic-configurator.list.card.conditions.chain.or",
                              )}
                            </ToggleGroup.Item>
                          </ToggleGroup.Root>
                          <HelpTooltip>
                            {t(
                              "packages.node-editor.logic-configurator.list.card.conditions.chain.help-tooltip.content",
                            )}
                          </HelpTooltip>
                        </>
                      ) : null}
                    </div>
                  </Popover.Root>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </>
      )}
    </Accordion.Content>
  );
}
