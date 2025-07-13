import type { TNodeId } from "../../../../../../tree/id";
import type { TTreeClient } from "../../../../../../tree/type/treeClient";
import { FormNode } from "../../../exports/plugin";
import type { TInputId } from "../../InputPlugin";
import type { TAnswer } from "../../types/answer";

export const reorderAnswers =
  (nodeId: TNodeId, inputId: TInputId, newAnswers: TAnswer[]) =>
  (treeClient: TTreeClient) => {
    const input = FormNode.inputs.getType(nodeId, inputId, [
      "multi-select",
      "select",
    ])(treeClient);

    if (!input) return;

    input.answers = newAnswers;
  };
