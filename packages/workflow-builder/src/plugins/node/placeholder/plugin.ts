import {
  type INode,
  NodePlugin,
  type canHaveTargetFn,
  type createFn,
  type createVariableFn,
  type hasTargetFn,
} from "../../../tree/type/plugin/NodePlugin";
import { RecordVariable } from "../../../variables/exports/types";
import { removePlaceholderNode } from "./migrations/removePlaceholderNode";

export const typeName = "placeholder" as const;

export type IPlaceholderNode = INode<typeof typeName>;

export class PlaceholderNodePlugin extends NodePlugin<IPlaceholderNode> {
  override isAddable = () => {
    return false;
  };

  description = "Empty description";
  readonly hasAction = false;
  readonly hasRenderer = false;
  readonly hasWebhook = false;
  readonly hasSidebar = false;
  readonly hasCanvasNode = false;

  constructor() {
    super({
      type: typeName,
      pluginMigrations: [removePlaceholderNode],
      blockGroup: "placeholder",
    });
  }

  create: createFn<IPlaceholderNode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<IPlaceholderNode>({
      type: this.type,
      version: this.version,
      pluginVersion: this.pluginVersion,
      ...data,
    });
  };

  canHaveTarget: canHaveTargetFn = (_) => (_) => false;

  hasTarget: hasTargetFn = (_) => (_) => false;

  createVariable: createVariableFn<never> =
    ({ nodeId, execution = "unexecuted" }) =>
    () => ({
      variable: RecordVariable.create({
        id: nodeId,
        execution,
        name: "Platzhalter",
        value: [],
        status: "ok",
      }),
    });

  getDescription = () => () => "";
}

export const PlaceholderNode = new PlaceholderNodePlugin();
