import type React from "react";
import type { TNodeId } from "../../tree/id";
import type { NodePlugin } from "../../tree/type/plugin/NodePlugin";
import type {
  IFileVariable,
  IRecordVariable,
  IRichTextVariable,
  PrimitiveVariable,
} from "../../variables/exports/types";

export type VariableNodePlugin = {
  plugin: NodePlugin;
  Icon?: React.ForwardRefExoticComponent<any> | (() => React.ReactNode);
};

export type VariableExtensionsParams = {
  variables?: Record<TNodeId, IRecordVariable<PrimitiveVariable>>;
  richTextVariables?: Record<TNodeId, IRecordVariable<IRichTextVariable>>;
  fileVariables?: Record<TNodeId, IRecordVariable<IFileVariable>>;
};
