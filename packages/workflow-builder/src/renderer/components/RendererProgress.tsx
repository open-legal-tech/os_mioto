import { Progress, type ProgressProps } from "@mioto/design-system/Progress";
import { getCurrentNode } from "../../interpreter/exports/methods";
import { useTreeClient } from "../../tree/sync/state";
import { useInterpreter, useRendererContext } from "../Context";
import { calculateProgress } from "./calculateProgress";

export default function RendererProgress(props: ProgressProps) {
  const {
    config: { startNodeId },
  } = useRendererContext();
  const { treeClient, nodePlugins } = useTreeClient();

  const currentNode = useInterpreter((state) =>
    getCurrentNode(treeClient, state.context),
  );

  return (
    <Progress
      value={calculateProgress(
        treeClient,
        nodePlugins,
        startNodeId,
      )(currentNode.id)}
      indicatorClassName="progress-indicator"
      {...props}
    />
  );
}
