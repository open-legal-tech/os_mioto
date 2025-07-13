import Badge from "@mioto/design-system/Badge";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import { textClasses } from "@mioto/design-system/Text/classes";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import { useTranslations } from "@mioto/locale";
import { Moon, Rocket } from "@phosphor-icons/react/dist/ssr";
import { Handle, Position } from "@xyflow/react";
import * as React from "react";
import { useTree } from "../../tree/sync/state";
import { useNodePlugin } from "../../tree/sync/treeStore/TreeContext";
import { nodeGroupColorSchemes } from "../../tree/type/plugin/NodePlugin";
import type { NodePluginProps } from "../editorTreeClient";
import {
  portWidth,
  sourcePortClasses,
  targetPortClasses,
} from "../plugin/components/Port";
import { useEditor, useEditorState } from "../useEditor";
import { nodeWidth } from "../utils/constants";
import { NodeTypeIcon } from "./NodeTypeIcon";

const nodeContainerClasses =
  "bg-white rounded border border-gray6 [&[data-connecting=false]:hover]:border-primary7 [&[data-connecting=true][data-connectable=true]]:cursor-Xhair [&[data-connecting=true][data-connectable=false]]:cursor-not-allowed";

export const CanvasNodeContainer = ({
  id,
  selected: isSelected,
  children,
  zIndex,
  className,
}: NodePluginProps) => {
  const t = useTranslations();
  const node = useTree((treeClient) => {
    return treeClient.nodes.get.single(id);
  });
  const plugin = useNodePlugin(id);

  const { isConnecting } = useEditor();
  const { connectingNodeId, validConnections } = useEditorState();

  const startNodeId = useTree((treeClient) => treeClient.get.startNodeId());

  const validConnectionTarget = React.useMemo(
    () => !isConnecting || (isConnecting && validConnections?.includes(id)),
    [isConnecting, validConnections, id],
  );

  const isStartNode = startNodeId === id;
  const isEndNode = node?.final;
  const isConnectingNode = connectingNodeId === id;
  const isTargetable = validConnectionTarget && !isConnectingNode;

  let BadgeComponent: React.ReactNode;

  if (isStartNode) {
    BadgeComponent = (
      <Badge
        tooltip={{
          children: t("packages.node-editor.canvas-node.start.tooltip"),
        }}
        data-testid="node-label"
        square
        className="colorScheme-inherit max-w-max p-1"
      >
        <Rocket />
      </Badge>
    );
  } else if (isEndNode) {
    BadgeComponent = (
      <Badge
        tooltip={{
          children: t("packages.node-editor.canvas-node.end.tooltip"),
        }}
        data-testid="node-label"
        square
        className="colorScheme-inherit max-w-max p-1"
      >
        <Moon />
      </Badge>
    );
  }

  return (
    <Stack
      className={twMerge(
        nodeContainerClasses,
        "[&[data-selected=true]]:shadow-[0px_0px_0px_4px_rgba(90,196,190,1)]",
        "transition-shadow border border-gray6 hover:shadow-md text-center overflow-hidden",
        className,
      )}
      style={{
        width: nodeWidth,
        height: "auto",
        opacity: validConnectionTarget ? 1 : 0.5,
        zIndex,
      }}
      data-selected={isSelected}
      aria-label={node.name}
    >
      <Row
        className={`text-center flex-1 text-colorScheme9 relative bg-colorScheme5 ${
          nodeGroupColorSchemes[plugin.blockGroup]
        } font-extraSmallText font-weak`}
      >
        <div className="grid grid-cols-3 items-center gap-2 p-1 flex-1">
          <Row className="gap-1">
            {BadgeComponent}
            <NodeTypeIcon
              type={node.type}
              className="max-w-max colorScheme-inherit"
            />
          </Row>
          <span>{t(`common.nodeNames.${node.type}.short` as any)}</span>
          <span />
        </div>
      </Row>
      <Handle
        className={targetPortClasses}
        style={{
          height: `${portWidth}px `,
          width: `${portWidth}px`,
        }}
        type="target"
        data-connecting={isConnecting}
        data-connectingnode={isConnectingNode}
        data-connectable={isTargetable}
        position={Position.Top}
        id={id}
        isConnectable={isConnecting}
        data-test={`${id}-target-port`}
        data-nodeid={id}
      />
      <Stack
        className="p-4 py-5 pb-6"
        data-nodeid={id}
        data-connecting={isConnecting}
        data-connectable={isTargetable}
      >
        <span
          data-connecting={isConnecting}
          data-nodeid={id}
          className={textClasses({ emphasize: "weak" })}
        >
          {children}
        </span>
      </Stack>
      <Handle
        className={sourcePortClasses}
        style={{
          width: `${portWidth}px`,
          height: `${portWidth}px `,
          opacity: isEndNode ? "0" : "1",
          pointerEvents: isEndNode ? "none" : "auto",
        }}
        type="source"
        data-active={isConnecting && connectingNodeId === id}
        position={Position.Bottom}
        data-testid={`${id}-source-port`}
        role="button"
        aria-label={t(
          "packages.node-editor.canvas-node.source-port.aria-label",
        )}
      />
    </Stack>
  );
};
