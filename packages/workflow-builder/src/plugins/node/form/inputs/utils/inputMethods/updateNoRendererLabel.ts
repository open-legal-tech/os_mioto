import type { TNodeId } from "../../../../../../tree/id";
import type { TTreeClient } from "../../../../../../tree/type/treeClient";
import { FormNode } from "../../../exports/plugin";
import type { TInputId } from "../../InputPlugin";

export const updateNoRendererLabel =
  (nodeId: TNodeId, inputId: TInputId, newState: boolean) =>
  (treeClient: TTreeClient) => {
    const input = FormNode.inputs.get(nodeId, inputId)(treeClient);

    input.noRendererLabel = newState;
  };
