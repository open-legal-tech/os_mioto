import type { TNodeId } from "../../../../../../tree/id";
import type { TTreeClient } from "../../../../../../tree/type/treeClient";
import { FormNode } from "../../../exports/plugin";
import type { TInputId } from "../../InputPlugin";

export const updatePlaceholder =
  (nodeId: TNodeId, inputId: TInputId, newValue: string) =>
  (treeClient: TTreeClient) => {
    const input = FormNode.inputs.getType(nodeId, inputId, [
      "text",
      "textarea",
      "number",
      "rich-text",
      "email",
    ])(treeClient);

    input.placeholder = newValue;
  };
