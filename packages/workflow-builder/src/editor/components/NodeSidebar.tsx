"use client";

import { Form } from "@mioto/design-system/Form";
import { Row } from "@mioto/design-system/Row";
import { Stack, stackClasses } from "@mioto/design-system/Stack";
import { Tabs } from "@mioto/design-system/Tabs";
import { ToggleGroup } from "@mioto/design-system/ToggleGroup";
import { useTranslations } from "@mioto/locale";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import type { TNodeId } from "../../tree/id";
import { useTree, useTreeClient } from "../../tree/sync/state";
import type { TNodeSidebarProps } from "../editorTreeClient";
import { NodeMenu } from "../plugin/components/NodeMenu";
import { useEditorState } from "../useEditor";
import { nodeNameMaxLength } from "../utils/constants";
import { CopyVariableKeyMenuItem } from "./CopyVariableKeyMenuItem";
import { NodeDropdown } from "./NodeDropdown";
import { useSidebarContext } from "./NodeEditor/Canvas/Sidebar";
import { NodeTypeIcon } from "./NodeTypeIcon";

export { useSidebarContext };

const hasContent = (node: any): node is { content: any } => {
  return node?.content;
};

const TabsContext = React.createContext<string | undefined>(undefined);

type RootProps = Omit<TNodeSidebarProps, "onEdgeCreate"> & {
  variableKey?: string;
};

export const NodeSidebarRoot = ({
  className,
  children,
  tabs = [],
  initialTab,
  variableKey,
}: RootProps) => {
  const [selectedTab, setSelectedTab] = React.useState(
    initialTab ?? tabs[0]?.key,
  );
  const { nodesToDelete } = useEditorState();

  const nodeId = useSidebarContext();
  const hasNode = useTree((treeClient) => treeClient.nodes.has(nodeId));

  if ((nodeId && nodesToDelete.includes(nodeId)) || !hasNode) return null;

  return (
    <Stack
      key={nodeId}
      className={`flex-1 h-full border-l border-gray5 nokey ${className}`}
    >
      <Header
        nodeId={nodeId}
        selectedTab={selectedTab}
        setSelectedTab={(value) => {
          setSelectedTab(value);
        }}
        tabs={tabs}
        variableKey={variableKey}
      />
      <TabsContext.Provider value={selectedTab}>
        <Tabs.Root
          value={selectedTab}
          className="h-full overflow-y-hidden isolate"
        >
          {children}
        </Tabs.Root>
      </TabsContext.Provider>
    </Stack>
  );
};

type HeaderProps = Omit<TNodeSidebarProps, "treeUuid"> & {
  nodeId: TNodeId;
  selectedTab?: string;
  setSelectedTab?: (value: string) => void;
  tabs: NonNullable<TNodeSidebarProps["tabs"]>;
  variableKey?: string;
};

const Header = ({
  nodeId,
  selectedTab,
  setSelectedTab,
  tabs,
  variableKey,
}: HeaderProps) => {
  const t = useTranslations();
  const { treeClient } = useTreeClient();

  const startNodeId = useTree((treeClient) => treeClient.get.startNodeId());

  const node = useTree((treeClient) => treeClient.nodes.get.single(nodeId));
  const nodeNames = useTree((treeClient) =>
    Object.values(treeClient.nodes.get.names())
      .filter((someNode) => someNode.id !== nodeId)
      .map((node) => node.name),
  );

  const isStartNode = nodeId === startNodeId;

  const methods = Form.useForm({
    defaultValues: {
      blockname: node?.name ?? "",
    },
    mode: "onChange",
  });

  return (
    <Form.Provider methods={methods}>
      <Form.Root
        onChange={({ blockname }) => {
          if (blockname) {
            const newBlockName = blockname.trim();
            treeClient.nodes.update.name(node.id, newBlockName);
          }
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        <header
          className={stackClasses({}, [
            "min-h-[26px] bg-gray2 gap-4 border-b border-gray5 p-4 z-10",
          ])}
        >
          <Row center className="justify-between w-full">
            <Row className="gap-1 items-center">
              <NodeTypeIcon type={node.type} className="text-largeText" />
              <NodeDropdown
                node={node}
                onSelect={(plugin) => {
                  const node = treeClient.nodes.get.single(nodeId);

                  const newNode = plugin.create({
                    content: hasContent(node) ? node?.content : undefined,
                    final: node?.final,
                    name: node?.name,
                    position: node?.position,
                    fallbackEdge: node?.fallbackEdge,
                    edges: node?.edges,
                  })(treeClient);

                  treeClient.nodes.replace(node.id, newNode);
                }}
              />
            </Row>
            <Row className="gap-2">
              <NodeMenu
                align="end"
                nodeId={node.id}
                isStartNode={isStartNode}
                name={node.name ?? "Kein Name"}
              >
                {variableKey ? (
                  <CopyVariableKeyMenuItem copyKey={variableKey} />
                ) : null}
              </NodeMenu>
            </Row>
          </Row>
          <Form.Field
            Label={t("packages.node-editor.nodeEditingSidebar.nameInput.label")}
            layout="inline-left"
          >
            <Form.Input
              {...methods.register("blockname", {
                validate: (value) => {
                  if (!value) return;

                  if (nodeNames.includes(value)) {
                    return t(
                      "packages.node-editor.nodeEditingSidebar.nameInput.error.duplicate",
                    );
                  }

                  return;
                },
                maxLength: {
                  value: nodeNameMaxLength,
                  message: t(
                    "packages.node-editor.nodeEditingSidebar.nameInput.error.too_long",
                  ),
                },
              })}
              placeholder={t(
                "packages.node-editor.nodeEditingSidebar.nameInput.placeholder",
              )}
              className="text-gray10"
              autoComplete="off"
            />
          </Form.Field>
          {tabs.length > 1 && selectedTab && setSelectedTab ? (
            <ToggleGroup.Root
              type="single"
              value={selectedTab}
              onValueChange={(value) => {
                if (value) setSelectedTab(value);
              }}
            >
              {tabs.map((tab, index) => (
                <ToggleGroup.Item key={tab.key} value={tab.key}>
                  {index + 1}. {tab?.label ?? tab.key}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          ) : null}
        </header>
      </Form.Root>
    </Form.Provider>
  );
};

type Props = {
  value: string;
  children: React.ReactNode;
};

export const NodeSidebarTab = ({ children, value }: Props) => {
  const selectedTab = React.useContext(TabsContext);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedTab === value ? (
        <Tabs.Content
          value={value}
          className="outline-none pb-4"
          asChild
          forceMount
          key={value}
        >
          <motion.div
            className={stackClasses({}, ["overflow-y-scroll h-full"])}
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              transition: { duration: 0.3 },
              y: 0,
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.1 },
            }}
          >
            {children}
          </motion.div>
        </Tabs.Content>
      ) : null}
    </AnimatePresence>
  );
};

export const NodeSidebar = {
  Root: NodeSidebarRoot,
  Tab: NodeSidebarTab,
  useSidebarContext,
};
