import type { TNodeId } from "../../../../../../tree/id";
import type {
  TReadOnlyTreeClient,
  TTreeClient,
} from "../../../../../../tree/type/treeClient";
import { FormNode } from "../../../exports/plugin";
import type { TInputId } from "../../InputPlugin";

export const getAnswer =
  (nodeId: TNodeId, inputId: TInputId, answerId: string) =>
  (treeClient: TTreeClient | TReadOnlyTreeClient) => {
    const input = FormNode.inputs.getType(nodeId, inputId, [
      "multi-select",
      "select",
    ])(treeClient);

    return input.answers?.find(({ id }) => id === answerId);
  };
