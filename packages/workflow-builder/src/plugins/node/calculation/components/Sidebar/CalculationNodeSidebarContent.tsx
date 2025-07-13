"use client";

import { Stack } from "@mioto/design-system/Stack";
import { match } from "ts-pattern";
import { NodeSidebar } from "../../../../../editor/components/NodeSidebar";
import { useTree } from "../../../../../tree/sync/state";
import { CalculationNode } from "../../plugin";
import { DateCalulationSidebar } from "./DateCalculationSidebar";
import { DateDifferenceSidebar } from "./DateDifferenceSidebar";
import { NumberCalculationSidebar } from "./NumberCalulationSidebar";
import { SelectCalulationType } from "./SelectCalculationType";

export function CalculationNodeSidebarContent() {
  const nodeId = NodeSidebar.useSidebarContext();
  const node = useTree(CalculationNode.getSingle(nodeId));

  return (
    <NodeSidebar.Tab value="content">
      <Stack className="gap-4 p-4">
        <SelectCalulationType nodeId={nodeId} />
        {match(node.calculationType)
          .with("number", () => <NumberCalculationSidebar nodeId={nodeId} />)
          .with("date", () => <DateCalulationSidebar nodeId={nodeId} />)
          .with("date-difference", () => (
            <DateDifferenceSidebar nodeId={nodeId} />
          ))
          .exhaustive()}
      </Stack>
    </NodeSidebar.Tab>
  );
}
