import { expect } from "@playwright/test";
import type { CanvasNodeComponent } from "../../CanvasNode";
import { CreateNodeDropdown } from "../../CreateNodeDropdown";
import type { Nodes } from "../Nodes";

export async function createNewNodeFromPort<TNewNodeType extends keyof Nodes>({
  plugin,
  coordinates = [100, 100],
  newNodeName,
  newNodeType,
  select,
}: {
  plugin: CanvasNodeComponent<any>;
  coordinates: [number, number];
  newNodeName: string;
  newNodeType: TNewNodeType;
  select?: boolean;
}) {
  await expect(plugin.locators.port).not.toBeDisabled();

  await plugin.locators.port.hover();
  await plugin.environment.page.waitForTimeout(50);
  await plugin.environment.page.mouse.down();
  await plugin.environment.page.waitForTimeout(50);
  await plugin.environment.page.mouse.move(coordinates[0], coordinates[1]);
  await plugin.environment.page.waitForTimeout(50);
  await plugin.environment.page.mouse.up();
  await plugin.environment.page.waitForTimeout(50);

  const newNodeDropdown = new CreateNodeDropdown(
    plugin.environment,
    "Blocktypen auswählen",
  );

  const nodePlugin = (await newNodeDropdown.selectOption(newNodeType))(
    newNodeName,
  ) as ReturnType<Nodes[TNewNodeType]>;

  if (select) {
    await nodePlugin.canvasNode.selectNode();
  }

  return nodePlugin;
}
