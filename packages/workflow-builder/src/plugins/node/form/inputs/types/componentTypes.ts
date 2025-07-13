import type { TNodeId } from "../../../../../tree/id";
import type { TInputId } from "../InputPlugin";

import type { JSX } from "react";

export type InputConfiguratorProps = {
  inputId: TInputId;
  withRequiredOption?: boolean;
  nodeId: TNodeId;
};

export type InputPrimaryActionSlotProps = {
  inputId: TInputId;
  nodeId: TNodeId;
};

export type InputRendererProps = {
  inputId: TInputId;
  nodeId: TNodeId;
  onSubmit?: (values: Record<string, string | string[]>) => void;
  className?: string;
  children?: React.ReactNode;
  required?: boolean;
};

export type InputConfigurator = (props: InputConfiguratorProps) => JSX.Element;

export type InputPrimaryActionSlot = (
  props: InputPrimaryActionSlotProps,
) => JSX.Element | null;

export type InputRenderer = (props: InputRendererProps) => JSX.Element | null;
