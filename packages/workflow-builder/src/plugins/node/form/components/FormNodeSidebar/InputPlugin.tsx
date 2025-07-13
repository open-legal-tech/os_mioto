import { Accordion } from "@mioto/design-system/Accordion";
import Badge from "@mioto/design-system/Badge";
import { sidebarCardClasses } from "@mioto/design-system/Card";
import Heading from "@mioto/design-system/Heading";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { IconButton } from "@mioto/design-system/IconButton";
import { Row, rowClasses } from "@mioto/design-system/Row";
import { Stack, stackClasses } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { Tooltip } from "@mioto/design-system/Tooltip";
import { useTranslations } from "@mioto/locale";
import { ArrowsDownUp, X } from "@phosphor-icons/react/dist/ssr";
import { Reorder } from "framer-motion";
import React from "react";
import { VariableTypeIcon } from "../../../../../editor/components/NodeTypeIcon";
import type { TNodeId } from "../../../../../tree/id";
import { useTree, useTreeClient } from "../../../../../tree/sync/state";
import { RecordVariable } from "../../../../../variables/exports/types";
import { GlobalVariablesNode } from "../../../global-variables/plugin";
import {
  type TFormNodeInput,
  formNodeInputPlugins,
} from "../../exports/inputPlugins";
import { FormNode } from "../../exports/plugin";
import { InputDropdown } from "../../inputs/components/InputDropdown";
import { InputMenu } from "../InputMenu";
import { formNodeInputPluginObjects } from "../inputPluginObjects";

type InputPluginComponentProps = {
  inputs: TFormNodeInput[];
  nodeId: TNodeId;
};

export function InputPlugin({ inputs, nodeId }: InputPluginComponentProps) {
  const { treeClient } = useTreeClient();
  const ref = React.useRef<HTMLDivElement | null>(null);

  const [openAccordionItems, setOpenAccordionItems] = React.useState<string[]>(
    [],
  );

  const [isReordering, setIsReordering] = React.useState(false);
  const t = useTranslations();

  return (
    <Accordion.Root
      type="multiple"
      value={isReordering ? [] : openAccordionItems}
      onValueChange={setOpenAccordionItems}
    >
      <Row className="justify-between items-center mb-2">
        <Row className="items-center gap-2">
          <Heading size="tiny" className="flex-1">
            {t("plugins.node.form.inputs.title.text")}
          </Heading>
          <HelpTooltip>
            {t("plugins.node.form.inputs.title.help-tooltip.content")}
          </HelpTooltip>
        </Row>
        <Row className="gap-2 items-center">
          {isReordering ? (
            <IconButton
              tooltip={{
                children: t("plugins.node.form.inputs.reorder.end.tooltip"),
              }}
              size="small"
              onClick={() => {
                setIsReordering(false);
              }}
              variant="tertiary"
            >
              <X />
            </IconButton>
          ) : (
            <IconButton
              tooltip={{
                children: t("plugins.node.form.inputs.reorder.start.tooltip"),
              }}
              size="small"
              onClick={() => {
                setIsReordering(true);
              }}
              variant="tertiary"
            >
              <ArrowsDownUp />
            </IconButton>
          )}
          <InputDropdown
            align="end"
            onSelect={(type) => {
              const input = formNodeInputPlugins[type]?.create({ t });
              FormNode.inputs.add(nodeId, input)(treeClient);
              setOpenAccordionItems((prev) => [...prev, input.id]);

              document.getElementById(input.id)?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            size="small"
            variant="secondary"
            colorScheme="primary"
            className="min-w-max"
          />
        </Row>
      </Row>
      {isReordering ? (
        <Reorder.Group
          className="gap-2 list-none p-0 grid"
          ref={ref}
          axis="y"
          values={inputs}
          onReorder={(newOrder) => {
            return FormNode.reorderInputs(nodeId, newOrder)(treeClient);
          }}
        >
          {inputs.map((input, index) => {
            return (
              <InputItem
                input={input}
                key={input.id}
                dragGroupRef={ref}
                nodeId={nodeId}
                position={index + 1}
                isReordering
              />
            );
          })}
        </Reorder.Group>
      ) : (
        <Stack className="gap-2" ref={ref}>
          {inputs.map((input, index) => {
            return (
              <InputItem
                input={input}
                key={input.id}
                dragGroupRef={ref}
                nodeId={nodeId}
                position={index + 1}
              />
            );
          })}
        </Stack>
      )}
    </Accordion.Root>
  );
}

type InputItemProps = {
  dragGroupRef: React.MutableRefObject<HTMLDivElement | null>;
  nodeId: TNodeId;
  input: TFormNodeInput;
  position: number;
  isReordering?: boolean;
};

const InputItem = React.forwardRef<HTMLDivElement, InputItemProps>(
  ({ input, dragGroupRef, nodeId, position, isReordering = false }, ref) => {
    const t = useTranslations();
    const ariaLabel =
      input.label && input.label.length > 0
        ? t("plugins.node.form.inputs.card.aria-label.when-reordering", {
            position,
            inputLabel: input.label,
          })
        : t(
            "plugins.node.form.inputs.card.aria-label.when-reordering-without-label",
            { position },
          );

    const [isDragged, setIsDragged] = React.useState(false);

    return isReordering ? (
      <Reorder.Item
        ref={ref}
        value={input}
        dragConstraints={dragGroupRef}
        onDrag={() => setIsDragged(true)}
        onDragEnd={() => setIsDragged(false)}
        className={stackClasses({}, [
          sidebarCardClasses(),
          "m-0 cursor-grab",
          isDragged ? "cursor-grab" : "",
        ])}
        aria-label={ariaLabel}
        role="listitem"
      >
        <AccordionItem
          nodeId={nodeId}
          input={input}
          isReordering={isReordering}
          className={isDragged ? "cursor-grabbing" : ""}
        />
      </Reorder.Item>
    ) : (
      <Stack
        ref={ref}
        className={stackClasses({}, [sidebarCardClasses(), "m-0"])}
        aria-label={ariaLabel}
        role="listitem"
      >
        <AccordionItem
          nodeId={nodeId}
          input={input}
          isReordering={isReordering}
        />
      </Stack>
    );
  },
);

type AccordionItemProps = Pick<
  InputItemProps,
  "input" | "nodeId" | "isReordering"
> & {
  input: TFormNodeInput;
  className?: string;
};

const AccordionItem = ({
  input,
  nodeId,
  isReordering,
  className,
}: AccordionItemProps) => {
  const t = useTranslations();
  const { treeClient } = useTreeClient();
  const InputComponents =
    formNodeInputPluginObjects[input.type]?.BuilderComponent;
  const nodeVariable = FormNode.createVariable({ nodeId })(treeClient).variable;
  const inputVariable = RecordVariable.getValue(
    nodeVariable,
    RecordVariable.createChildIdPath(nodeId, input.id),
  );

  const nodeName = useTree((treeClient) => {
    return treeClient.nodes.get.single(nodeId)?.name;
  });

  const onClick = React.useCallback(() => {
    FormNode.inputs.delete(nodeId, input.id)(treeClient);
  }, [input.id, nodeId, treeClient]);

  const globalVariable = useTree((treeClient) =>
    input.globalVariableReferences
      ? GlobalVariablesNode.getSingle(GlobalVariablesNode.id)(treeClient)
          .variables[input.globalVariableReferences]
      : undefined,
  );

  return (
    <Accordion.Item value={input.id} className={`border-none`}>
      {globalVariable ? (
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Text
              className="p-1 pl-4 bg-gray2 border-b-gray4 rounded border-b flex gap-1 font-weak"
              size="small"
            >
              {globalVariable.name.length > 0 ? (
                globalVariable.name
              ) : (
                <i>{t("app.editor.global-variables.card.no-name")}</i>
              )}
            </Text>
          </Tooltip.Trigger>
          <Tooltip.Content>
            {t("plugins.node.form.inputs.global-variable.tooltip", {
              variableType: t(`common.variableNames.${globalVariable.type}`),
              variableName: globalVariable.name,
            })}
          </Tooltip.Content>
        </Tooltip.Root>
      ) : null}
      <Row className="justify-between p-2 pl-4 flex-1 gap-1 items-center">
        <Accordion.Trigger
          containerClassName="flex-1"
          className={rowClasses({}, [
            "focus-visible:outer-focus rounded items-center justify-between font-weak",
            isReordering ? "cursor-grab" : "cursor-pointer",
            className,
          ])}
        >
          <Row className="items-center justify-between flex-1">
            <Row className="gap-2 items-center text-start" id={input.id}>
              {inputVariable ? (
                <VariableTypeIcon type={inputVariable.type} />
              ) : null}
              {input.label}
            </Row>
            <Badge
              colorScheme="gray"
              tooltip={{
                children: t(`plugins.node.form.${input.type}.description`),
              }}
            >
              {t(`plugins.node.form.${input.type}.name`)}
            </Badge>
          </Row>
          <Accordion.Arrow />
        </Accordion.Trigger>
        <InputMenu
          inputPlugins={formNodeInputPluginObjects}
          input={input}
          nodeId={nodeId}
          onDelete={onClick}
          variableName={[nodeName, input.label]}
          disabled={isReordering}
        />
      </Row>
      {InputComponents.InputConfigurator ? (
        <Accordion.Content>
          <InputComponents.InputConfigurator
            inputId={input.id}
            withRequiredOption
            nodeId={nodeId}
          />
        </Accordion.Content>
      ) : null}
    </Accordion.Item>
  );
};
