import type { TNodeId } from "../../../../../../tree/id";
import type { TTreeClient } from "../../../../../../tree/type/treeClient";
import { FormNode } from "../../../exports/plugin";
import type { TInputId } from "../../InputPlugin";

export const updateRequired =
  (nodeId: TNodeId, inputId: TInputId, newValue: boolean) =>
  (treeClient: TTreeClient) => {
    const input = FormNode.inputs.get(nodeId, inputId)(treeClient);

    input.required = newValue;
  };
