import type { z } from "zod";
import {
  NodePlugin,
  type canHaveTargetFn,
  type createFn,
  type createVariableFn,
  type hasTargetFn,
} from "../../../tree/type/plugin/NodePlugin";
import type { Variable } from "../../../variables/exports/types";
import type { ZLogicNode } from "./type";

export const logicNodeType = "logic" as const;

export type ILogicNode = z.infer<ReturnType<typeof ZLogicNode>>;

export class LogicNodePlugin extends NodePlugin<ILogicNode> {
  readonly hasAction = false;
  readonly hasRenderer = false;
  readonly hasWebhook = false;
  readonly hasSidebar = true;
  readonly hasCanvasNode = true;
  description =
    "Der Logikblock wird verwendet, um den Nutzer im Baum zu leiten. Er produziert keine Variable.";

  constructor() {
    super({
      type: logicNodeType,
      pluginMigrations: [],
      blockGroup: "structure",
    });
  }

  override shouldIncludeInNavigation(
    _variables: Record<`node_${string}`, Variable>,
  ): boolean {
    return false;
  }

  create: createFn<ILogicNode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<ILogicNode>({
      type: this.type,
      version: this.version,
      pluginVersion: this.pluginVersion,
      ...data,
    });
  };

  canHaveTarget: canHaveTargetFn = () => () => true;

  hasTarget: hasTargetFn = (nodeId) => (treeClient) => {
    const nodesEdges = treeClient.edges.get.byNode(nodeId);

    // We filter the source edges by those that have a target. The source edges describe the edges that are coming out of the node.
    return (
      Object.values(nodesEdges?.source ?? {}).filter((edge) => edge.target)
        .length > 0
    );
  };

  createVariable: createVariableFn<never> =
    ({ nodeId, execution = "unexecuted" }) =>
    (treeClient) => {
      const node = treeClient.nodes.get.single(nodeId);
      return {
        variable: treeClient.nodes.create.variable(node, {
          execution,
          value: [],
        }),
      };
    };

  getDescription = (node: ILogicNode) => () => {
    return `Block ${node.name} is of type ${node.type}.`;
  };
}

export const LogicNode = new LogicNodePlugin();
