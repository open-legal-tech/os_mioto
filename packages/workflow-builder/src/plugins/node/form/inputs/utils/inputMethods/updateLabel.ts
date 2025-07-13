import type { TNodeId } from "../../../../../../tree/id";
import type { TTreeClient } from "../../../../../../tree/type/treeClient";
import { FormNode } from "../../../exports/plugin";
import type { TInputId } from "../../InputPlugin";

export const updateLabel =
  (nodeId: TNodeId, inputId: TInputId, newLabel: string) =>
  (treeClient: TTreeClient) => {
    const input = FormNode.inputs.get(nodeId, inputId)(treeClient);

    if (!input) return;

    input.label = newLabel;
  };
