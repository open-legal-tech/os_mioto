import type { INode } from "../../../../../../tree/type/plugin/NodePlugin";
import type { IInput, TInputId } from "../../InputPlugin";

export interface InputWithRequired extends IInput<string> {
  required: boolean;
}

export interface NodeWithInput extends INode<string> {
  input?: TInputId;
}

export interface InputWithPlaceholder extends IInput<string> {
  placeholder?: string;
}
