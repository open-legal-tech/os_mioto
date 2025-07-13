"use client";

import { buttonClasses } from "@mioto/design-system/Button";
import { cardClasses } from "@mioto/design-system/Card";
import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { Form } from "@mioto/design-system/Form";
import Heading from "@mioto/design-system/Heading";
import { headingClasses } from "@mioto/design-system/Heading/classes";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { IconButton } from "@mioto/design-system/IconButton";
import Input from "@mioto/design-system/Input";
import Label from "@mioto/design-system/Label";
import { Row, rowClasses } from "@mioto/design-system/Row";
import { Select } from "@mioto/design-system/Select";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { useLocale, useTranslations } from "@mioto/locale";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { mapValues } from "remeda";
import { NodeSidebar } from "../../../../../editor/components/NodeSidebar";
import { VariableTypeIcon } from "../../../../../editor/components/NodeTypeIcon";
import { useEditorVariables } from "../../../../../editor/useEditorVariables";
import { RichInput } from "../../../../../rich-text-editor/exports/RichInput/RichInput";
import { RichTextEditor } from "../../../../../rich-text-editor/exports/RichText/RichTextEditor";
import { useTree, useTreeClient } from "../../../../../tree/sync/state";
import type {
  IMultiSelectVariable,
  PrimitiveVariable,
} from "../../../../../variables/exports/types";
import { AINode } from "../../exports/plugin";
import { FileSelector } from "./FileSelector";
import { SelectAIType } from "./SelectAIType";

export function AINodeSidebarContent() {
  const nodeId = NodeSidebar.useSidebarContext();
  const node = useTree(AINode.getSingle(nodeId));

  return (
    <NodeSidebar.Tab value="configuration">
      <Stack className="p-4 gap-4">
        <SelectAIType nodeId={nodeId} />
        {node.aiType === "decision" ? (
          <AIDecisionNodeSidebar />
        ) : (
          <AIExtractionNodeSidebar />
        )}
      </Stack>
    </NodeSidebar.Tab>
  );
}

function AIExtractionNodeSidebar() {
  const nodeId = NodeSidebar.useSidebarContext();
  const t = useTranslations();
  const node = useTree(AINode.getSingle(nodeId));
  const { treeClient } = useTreeClient();

  const id = React.useId();

  const methods = Form.useForm({
    defaultValues: mapValues(node.prompts, (prompt) => ({
      name: prompt.name,
      type: prompt.type,
    })),
  });

  const select = Select.useSelectStore({
    value: node.model,
    setValue: (key) => {
      if (typeof key !== "string") {
        console.error("The selected theme key is not a string.");
        return;
      }

      AINode.updateModel(nodeId, key as any)(treeClient);
    },
  });

  return (
    <>
      <Select.Root
        options={[
          {
            id: "gpt-3.5",
            name: t("plugins.node.AI.sidebar.extraction.models.gpt-35"),
            type: "option",
            data: {},
          },
          {
            id: "gpt-4",
            name: t("plugins.node.AI.sidebar.extraction.models.gpt-4"),
            type: "option",
            data: {},
          },
        ]}
        store={select}
      >
        <Row className="justify-between">
          <Select.Label className={headingClasses({ size: "tiny" })}>
            {t("plugins.node.AI.sidebar.extraction.models.label")}
          </Select.Label>
          <Select.Input />
        </Row>
        <Select.Content />
      </Select.Root>
      <RichTextEditor
        yContent={node.yMainPrompt}
        Label={(props) => (
          <Label
            className={headingClasses({ size: "tiny", className: "mb-2" })}
            {...props}
          >
            {t("plugins.node.AI.sidebar.extraction.meta-prompt.heading")}
          </Label>
        )}
      />
      <Row className="justify-between items-center">
        <Heading size="tiny">
          {t("plugins.node.AI.sidebar.extraction.extraction.heading")}
        </Heading>
        <DropdownMenu.Root>
          <DropdownMenu.Button className={buttonClasses({ size: "small" })}>
            {t("plugins.node.AI.sidebar.extraction.extraction.button-label")}
          </DropdownMenu.Button>
          <DropdownMenu.Content align="end" sideOffset={5}>
            <DropdownMenu.Item
              onSelect={() => AINode.addPrompt(nodeId, {})(treeClient)}
            >
              {t("plugins.node.AI.prompt-types.text")}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() =>
                AINode.addPrompt(nodeId, { type: "number" })(treeClient)
              }
            >
              {t("plugins.node.AI.prompt-types.number")}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() =>
                AINode.addPrompt(nodeId, { type: "boolean" })(treeClient)
              }
            >
              {t("plugins.node.AI.prompt-types.boolean")}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Row>
      <Stack className="gap-6">
        <Form.Provider methods={methods}>
          <Form.Root
            onChange={(data) => AINode.updatePrompts(nodeId, data)(treeClient)}
          >
            {Object.values(node.prompts).map((prompt) => (
              <Stack className={cardClasses("p-0")} key={prompt.id}>
                <header
                  className={rowClasses(
                    {},
                    "justify-between items-center p-4 py-2",
                  )}
                >
                  <Text className="flex items-center gap-2" emphasize="weak">
                    <VariableTypeIcon type={prompt.type} />
                    {t(`plugins.node.AI.prompt-types.${prompt.type}`)}
                  </Text>
                  <Row>
                    <IconButton
                      tooltip={{
                        children: t(
                          "plugins.node.AI.sidebar.extraction.extraction.delete.tooltip",
                        ),
                      }}
                      onClick={() =>
                        AINode.removePrompt(nodeId, prompt.id)(treeClient)
                      }
                    >
                      <Trash />
                    </IconButton>
                  </Row>
                </header>
                <Stack className="bg-gray1 p-4 gap-3 border-t border-gray2">
                  <Stack className="gap-2">
                    <Label>
                      {t(
                        "plugins.node.AI.sidebar.extraction.extraction.name.label",
                      )}
                    </Label>
                    <Input
                      className="bg-white"
                      {...methods.register(`${prompt.id}.name`)}
                      placeholder={t(
                        "plugins.node.AI.sidebar.extraction.extraction.name.placeholder",
                      )}
                    />
                  </Stack>
                  <RichInput
                    className="bg-white"
                    Label={t(
                      "plugins.node.AI.sidebar.extraction.extraction.prompt.label",
                    )}
                    yContent={prompt.yDescription}
                    placeholder={t(
                      "plugins.node.AI.sidebar.extraction.extraction.prompt.placeholder",
                    )}
                  />
                  {prompt.type === "text" ? (
                    <RichInput
                      className="bg-white"
                      Label={(props) => (
                        <Label {...props}>
                          {t(
                            "plugins.node.AI.sidebar.extraction.extraction.formatting-instructions.label",
                          )}
                          <HelpTooltip>
                            {t.rich(
                              "plugins.node.AI.sidebar.extraction.extraction.formatting-instructions.help-tooltip",
                            )}
                          </HelpTooltip>
                        </Label>
                      )}
                      yContent={prompt.yFormattingInstruction}
                      placeholder={t(
                        "plugins.node.AI.sidebar.extraction.extraction.formatting-instructions.placeholder",
                      )}
                    />
                  ) : null}
                </Stack>
              </Stack>
            ))}
          </Form.Root>
        </Form.Provider>
      </Stack>
      <Label className="flex-col flex items-start">
        {t("plugins.node.AI.sidebar.extraction.files.label")}
        <FileSelector nodeId={nodeId} id={id} />
      </Label>
    </>
  );
}

function AIDecisionNodeSidebar() {
  const nodeId = NodeSidebar.useSidebarContext();
  const locale = useLocale();
  const t = useTranslations();
  const node = useTree(AINode.getSingle(nodeId));
  const editorVariables = useEditorVariables({
    excludeIds: [nodeId],
    filterPrimitives: (
      variable,
    ): variable is Exclude<PrimitiveVariable, IMultiSelectVariable> =>
      variable.type === "number" ||
      variable.type === "text" ||
      variable.type === "select" ||
      variable.type === "date",
  });
  const { treeClient } = useTreeClient();

  const id = React.useId();

  const select = Select.useSelectStore({
    value: node.model,
    setValue: (key) => {
      if (typeof key !== "string") {
        console.error("The selected theme key is not a string.");
        return;
      }

      AINode.updateModel(nodeId, key as any)(treeClient);
    },
  });

  return (
    <>
      <Select.Root
        options={[
          {
            id: "gpt-3.5",
            name: t("plugins.node.AI.sidebar.extraction.models.gpt-35"),
            type: "option",
            data: {},
          },
          {
            id: "gpt-4",
            name: t("plugins.node.AI.sidebar.extraction.models.gpt-4"),
            type: "option",
            data: {},
          },
        ]}
        store={select}
      >
        <Row className="justify-between">
          <Select.Label className={headingClasses({ size: "tiny" })}>
            {t("plugins.node.AI.sidebar.extraction.models.label")}
          </Select.Label>
          <Select.Input />
        </Row>
        <Select.Content />
      </Select.Root>
      <RichTextEditor
        yContent={node.yMainPrompt}
        Label={(props) => (
          <Label
            className={headingClasses({ size: "tiny", className: "mb-2" })}
            {...props}
          >
            {t("plugins.node.AI.sidebar.decision.meta-prompt.heading")}
          </Label>
        )}
      />
      <Label className="flex-col flex items-start">
        {t("plugins.node.AI.sidebar.extraction.files.label")}
        <FileSelector nodeId={nodeId} id={id} />
      </Label>
    </>
  );
}
