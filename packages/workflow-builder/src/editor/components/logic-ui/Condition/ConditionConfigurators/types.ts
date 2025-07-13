import type { TNodeId } from "../../../../../tree/id";
import type { VariableSelectorProps } from "../VariableSelector";

export type ConfiguratorProps = {
  nodeId?: TNodeId;
  onVariableSelect: VariableSelectorProps["onSelect"];
  onReset: () => void;
};
