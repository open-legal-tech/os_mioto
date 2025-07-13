import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { IconButton } from "@mioto/design-system/IconButton";
import { useTranslations } from "@mioto/locale";
import {
  DotsThree,
  FilePlus,
  Moon,
  Rocket,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import type { TNodeId } from "../../../tree/id";
import { useTree, useTreeClient } from "../../../tree/sync/state";
import { useNodePlugin } from "../../../tree/sync/treeStore/TreeContext";
import { useEditor } from "../../useEditor";

const MakeFinal = ({ nodeId }: { nodeId: TNodeId }) => {
  const t = useTranslations();
  const { treeClient } = useTreeClient();
  const isFinal = useTree(
    (treeClient) => treeClient.nodes.get.single(nodeId).final,
  );

  return (
    <DropdownMenu.Item
      onSelect={() => treeClient.nodes.update.final(nodeId, !isFinal)}
      Icon={<Moon />}
    >
      {isFinal
        ? t("packages.node-editor.node-menu.endNode.remove.label")
        : t("packages.node-editor.node-menu.endNode.add.label")}
    </DropdownMenu.Item>
  );
};

const MakeStartNode = ({ nodeId }: { nodeId: TNodeId }) => {
  const t = useTranslations();
  const { treeClient } = useTreeClient();
  const isFinal = useTree(
    (treeClient) => treeClient.nodes.get.single(nodeId).final,
  );

  return !isFinal ? (
    <DropdownMenu.Item
      onSelect={() => treeClient.updateStartNode(nodeId)}
      Icon={<Rocket />}
    >
      {t("packages.node-editor.node-menu.makeStartNode.label")}
    </DropdownMenu.Item>
  ) : null;
};

const DeleteNode = ({ nodeId }: { nodeId: TNodeId }) => {
  const t = useTranslations();
  const { removeSelectedNodes, setNodesToDelete } = useEditor();
  const isStartNode = useTree(
    (treeClient) => treeClient.get.startNodeId() === nodeId,
  );

  return isStartNode ? (
    <DropdownMenu.Item
      className="colorScheme-danger"
      disabled={{
        reason: t(
          "packages.node-editor.node-menu.deleteNode.disabledForStartNodeLabel",
        ),
      }}
      Icon={<Trash />}
    >
      {t("packages.node-editor.node-menu.deleteNode.label")}
    </DropdownMenu.Item>
  ) : (
    <DropdownMenu.Item
      onSelect={() => {
        removeSelectedNodes();
        setNodesToDelete([nodeId]);
      }}
      Icon={<Trash />}
    >
      {t("packages.node-editor.node-menu.deleteNode.label")}
    </DropdownMenu.Item>
  );
};

type DuplicateNodeProps = {
  nodeId: TNodeId;
};

const DuplicateNodeItem = ({ nodeId }: DuplicateNodeProps) => {
  const t = useTranslations();
  const plugin = useNodePlugin(nodeId);

  const { treeClient } = useTreeClient();

  return (
    <DropdownMenu.Item
      onSelect={() => {
        const newNode = plugin.duplicate(nodeId)(treeClient);

        treeClient.nodes.add(newNode);
      }}
      Icon={<FilePlus />}
    >
      {t("packages.node-editor.node-menu.duplicateNode.label")}
    </DropdownMenu.Item>
  );
};

type Props = {
  isStartNode?: boolean;
  nodeId: TNodeId;
  name: string;
  className?: string;
  children?: React.ReactNode;
} & DropdownMenu.ContentProps;

type MenuProps = {
  children?: React.ReactNode;
} & DuplicateNodeProps;

const StartNodeMenu = ({ nodeId, children }: MenuProps) => (
  <>
    <DuplicateNodeItem nodeId={nodeId} />
    {children}
    <DeleteNode nodeId={nodeId} />
  </>
);

const Menu = ({ children, nodeId }: MenuProps) => (
  <>
    <MakeStartNode nodeId={nodeId} />
    <MakeFinal nodeId={nodeId} />
    <DuplicateNodeItem nodeId={nodeId} />
    {children}
    <DeleteNode nodeId={nodeId} />
  </>
);

export function NodeMenu({
  isStartNode = false,
  name,
  nodeId,
  className,
  children,
  ...props
}: Props) {
  const t = useTranslations();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton
          tooltip={{
            children: t("packages.node-editor.node-menu.iconLabel", { name }),
          }}
          className={className}
        >
          <DotsThree weight="bold" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content {...props}>
        {isStartNode ? (
          <StartNodeMenu nodeId={nodeId}>{children}</StartNodeMenu>
        ) : (
          <Menu nodeId={nodeId}>{children}</Menu>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
