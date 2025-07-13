import type { TNodeId } from "../../../../../../tree/id";
import type { TTreeClient } from "../../../../../../tree/type/treeClient";
import type { TInputId } from "../../InputPlugin";
import { getAnswer } from "./getAnswer";

export const updateAnswer =
  (nodeId: TNodeId, inputId: TInputId, answerId: string, newValue: string) =>
  (treeClient: TTreeClient) => {
    const answer = getAnswer(nodeId, inputId, answerId)(treeClient);

    if (!answer) return;

    answer.value = newValue;
  };
