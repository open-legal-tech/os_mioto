import type { TNodeId } from "../../../../../../tree/id";
import type { TTreeClient } from "../../../../../../tree/type/treeClient";
import { FormNode } from "../../../exports/plugin";
import type { TInputId } from "../../InputPlugin";

export const deleteAnswer =
  (nodeId: TNodeId, inputId: TInputId, answerId: string) =>
  (treeClient: TTreeClient) => {
    const input = FormNode.inputs.getType(nodeId, inputId, [
      "multi-select",
      "select",
    ])(treeClient);

    if (!input) return;

    const answerIndex = input.answers?.findIndex(({ id }) => id === answerId);

    if (!(answerIndex !== null)) return;

    input.answers?.splice(answerIndex, 1);
  };
