import type { XmlFragment } from "yjs";
import type { pluginMigrationFn } from "../../../../tree/type/migrations/createPluginMigration";
import type { INode } from "../../../../tree/type/plugin/NodePlugin";
import type { ICalculationNode, calculationNodeType } from "../plugin";

export interface ICurrentCalculationNode
  extends INode<typeof calculationNodeType> {
  yContent: XmlFragment;
}

export const renameYContentToYFormular: pluginMigrationFn<
  ICurrentCalculationNode & ICalculationNode
> = (_) => async (node, yMap) => {
  if (yMap.has("yFormular")) return;

  console.log(
    `Migrating ${node.id} by renaming the yContent property to yFormular.`,
  );

  const yContent = yMap.get("yContent")?.clone();

  yMap.set("yFormular", yContent);
  yMap.delete("yContent");
};
