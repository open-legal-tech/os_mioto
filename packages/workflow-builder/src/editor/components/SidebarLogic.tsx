"use client";

import { NodeSidebarTab } from "./NodeSidebar";
import { LogicConfigurator } from "./logic-ui/LogicConfigurator";

type Props = {
  value: string;
};

export function SidebarLogic({ value }: Props) {
  return (
    <NodeSidebarTab value={value}>
      <LogicConfigurator />
    </NodeSidebarTab>
  );
}
