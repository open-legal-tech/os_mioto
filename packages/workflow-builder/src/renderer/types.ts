import type { ClassNamesProp } from "@mioto/design-system/utils/types";
import type { TNodeId } from "../tree/id";
import type { TTreeClient } from "../tree/type/treeClient";
import type { TModuleVariableValue } from "../variables/exports/types";
import type { RendererClientProps } from "./components/RendererClient";

import type { JSX } from "react";

export type NodeRendererProps = {
  className?: string;
  withNavigation?: boolean;
  classNames?: ClassNamesProp;
  nodeId: TNodeId;
};

export type TNodeRenderer = (props: NodeRendererProps) => JSX.Element | null;

export type RendererLoaderParams = {
  nodeId: TNodeId;
  treeUuid: string;
  treeClient: TTreeClient;
  context: TModuleVariableValue;
};

export type TNodeRendererLoader = (
  params: RendererLoaderParams,
) => Promise<any>;

export type SharedRendererProps = Pick<
  RendererClientProps,
  "session" | "environment" | "userUuid" | "RestartButton"
>;
