import type { Icon } from "@phosphor-icons/react";
import type { NodeProps } from "@xyflow/react";
import type React from "react";
import type { TTreeClientWithPlugins } from "../tree/createTreeClientWithPlugins";
import type { TNodeId } from "../tree/id";

import type { JSX } from "react";

export type NodePluginProps = Omit<NodeProps, "id"> & {
  className?: string;
  children?: React.ReactNode;
  id: TNodeId;
};

export type TCanvasNode = (props: NodePluginProps) => JSX.Element | null;

export type TNodeSidebarProps = {
  className?: string;
  children?: React.ReactNode;
  tabs?: { key: string; label?: string }[];
  initialTab?: string;
  treeUuid: string;
};

export type TNodeSidebar = (
  props: TNodeSidebarProps,
) => JSX.Element | null | Promise<JSX.Element | null>;

export type EditorPlugin = {
  Node: TCanvasNode | null;
  Sidebar: TNodeSidebar | null;
  Icon: Icon | null;
};

export type EditorPlugins = Record<
  Exclude<
    keyof TTreeClientWithPlugins["nodePlugins"],
    "decision" | "placeholder"
  >,
  EditorPlugin
>;
